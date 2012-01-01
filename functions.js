function sigmoid(netinput, response){
  return 1.0 / (1.0 + Math.exp(-netinput / response));
}

function vector2d(x, y){
  this.x = x
  this.y = y
  
  this.add = function(other){
    return new vector2d(this.x + other.x, this.y + other.y);
  }
  
  this.sub = function(other){
    return new vector2d(this.x - other.x, this.y - other.y);
  }
  
  this.scale = function(scale){
    return new vector2d(this.x * scale, this.y * scale);
  }
  
  this.length = function(){
    return Math.sqrt(this.dot(this));
  }
  
  this.angle = function(other){
    return Math.acos(this.dot(other) / (this.length() * other.length()));
  }
  
  this.setAngleVector = function(len, angle){
    this.x = -len * Math.sin(angle);
    this.y = len * Math.cos(angle);
    return this;
  }
  
  this.dot = function(other){
    return this.x * other.x + this.y * other.y;
  }
  
  this.normalize = function(){
    var l = this.length()
    return new vector2d(this.x / l, this.y / l);
  }
  
  this.clone = function(){
    return new vector2d(this.x, this.y);
  }
  
  this.distanceSquared = function(other){
    var xlen = this.x - other.x;
    var ylen = this.y - other.y;
    return xlen * xlen + ylen * ylen;
  }
  
  this.toString = function(){
    return "(" + this.x + ", " + this.y + ")";
  }

}

function vector2dCompareX(vector2dA, vector2dB){
  return vector2dA.x - vector2dB.x;
}

function vector2dCompareY(vector2dA, vector2dB){
  return vector2dA.y - vector2dB.y;
}

function clamp(value, maximum, minimum){
  if (value > maximum) return maximum;
  else if (value < minimum) return minimum;
  else return value; 
}

function averageList(numList, numPoints){
  var all = Math.floor(numList.length / numPoints);
  var extra = numList.length % numPoints;
  var avgList = new Array(Math.min(numList.length, numPoints));
  var k = 0;
  for (var i = 0; i < numList.length;){
    avgList[k] = 0;
    for (var j = 0; j < all; j++){
      avgList[k] += numList[i];
      i++; 
    }
    if (k < extra){
      avgList[k] += numList[i];
      avgList[k] /= all + 1;
      i++;
    }
    else{
      avgList[k] /= all;
    }
    k++;
  }
  return avgList;
}
 
 