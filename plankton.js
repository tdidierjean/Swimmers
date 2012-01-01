function kdtree(points){
  this.create = function(pointList, depth){
    if (!pointList.length) return null;
    if (depth % 2) pointList.sort(vector2dCompareX);
    else pointList.sort(vector2dCompareY);
    var mid = Math.floor(pointList.length / 2);
    var node = new Object();
    node.value = pointList[mid];
    node.left = this.create(pointList.slice(0, mid), depth + 1);
    node.right = this.create(pointList.slice(mid + 1), depth + 1);
    return node;
  }
  
  this.insertHelper = function(point, node, depth){
    if (!Boolean(node)){
      var node = new Object();
      node.left = null;
      node.right = null;
      node.value = point;
    }
    else{
      var dim = depth % 2 ? "x" : "y";
      if (node.value[dim] > point[dim]) node.left = this.insertHelper(point, node.left, depth + 1);
      else node.right = this.insertHelper(point, node.right, depth + 1);
    }
    return node;
  }
  
  this.insert = function(point){
    this.length++;
    this.root = this.insertHelper(point, this.root, 0);
    return this;
  }
  
  this.insertList = function(points){
    for (var i in points) this.insert(points[i]);
    return this;
  }
  
  this.containsHelper = function(point, node, depth){
    if (!Boolean(node)) return false;
    var dim = depth % 2 ? "x" : "y";
    if ((node.value.x == point.x) && (node.value.y == point.y)) return true;
    if (node.value[dim] > point[dim]) return this.containsHelper(point, node.left, depth + 1);
    else if (node.value[dim] < point[dim]) return this.containsHelper(point, node.right, depth + 1);
    else{
      if(this.containsHelper(point, node.left, depth + 1)) return true;
      if(this.containsHelper(point, node.right, depth + 1)) return true;
      return false;
    }
  }
  
  this.contains = function(point){
    return this.containsHelper(point, this.root, 0);
  }

  this.nearestNeighborHelper = function(point, node, depth, best, bestDist){
    if (!Boolean(node)) return [best, bestDist];
    var dim = depth % 2 ? "x" : "y";
    if (!Boolean(best)){
      best = node.value;
      bestDist = node.value.distanceSquared(point);
    }
    else{
      var hereDist = node.value.distanceSquared(point);
      if (hereDist < bestDist){
        bestDist = hereDist;
        best = node.value;
      }
    }
          
    if (node.value[dim] > point[dim]) var ret = this.nearestNeighborHelper(point, node.left, depth + 1, best, bestDist);
    else var ret = this.nearestNeighborHelper(point, node.right, depth + 1, best, bestDist);
    best = ret[0];
    bestDist = ret[1];
    
    if (bestDist > (node.value[dim] - point[dim]) * (node.value[dim] - point[dim])){
      if (node.value[dim] > point[dim]) var ret = this.nearestNeighborHelper(point, node.right, depth + 1, best, bestDist);
      else var ret = this.nearestNeighborHelper(point, node.left, depth + 1, best, bestDist);
    }
    
    return ret;
  }  
  
  this.nearestNeighbor = function(point){
    return this.nearestNeighborHelper(point, this.root, 0, null, 10000000000);
  }
  
  this.findminHelper = function(node, descrim, depth){
    var temp1 = null;
    var temp2 = null;
    if (!Boolean(node)) return null;
    temp1 = this.findminHelper(node.left, descrim, depth + 1);
    var dim = descrim % 2 ? "x" : "y";
    if ((descrim % 2) != (depth % 2)){
      temp2 = this.findminHelper(node.right, descrim, depth + 1);
      if (!Boolean(temp1) || Boolean(temp2) && (temp1[dim] > temp2[dim])) temp1 = temp2;
    }
    if (!Boolean(temp1) || (temp1[dim] > node.value[dim])) return node.value;
    else return temp1;
  }
  
//    this.removeHelper = function(node, point, depth){
//      var dim = depth % 2 ? "x" : "y";
//      if (!Boolean(node)) return null;
//      else if (point[dim] < node.value[dim]) node.left = this.removeHelper(node.left, point, depth + 1);
//      else if (point[dim] > node.value[dim]) node.right = this.removeHelper(node.right, point, depth + 1);
//      else{ // Found the point.
//        if (!Boolean(node.right)){
//          if (!Boolean(node.left)) return null; // Leaf node, so drop.
//          else{
//            node.right = node.left;
//            node.left = null;
//          }
//        }
//        var temp = this.findminHelper(node.right, depth, depth + 1);
//        node.right = this.removeHelper(node.right, temp, depth + 1);
//        node.value = temp;
//      }
//      return node;
//    }

   this.removeHelper = function(node, point, depth){
     if (!Boolean(node)) return null;
     var dim = depth % 2 ? "x" : "y";
    if ((node.value.x == point.x) && (node.value.y == point.y)){
      if (!Boolean(node.right)){
         if (!Boolean(node.left)) return null; // Leaf node, so drop.
         else{
           node.right = node.left;
           node.left = null;
         }
       }
       var temp = this.findminHelper(node.right, depth, depth + 1);
       node.right = this.removeHelper(node.right, temp, depth + 1);
       node.value = temp;
    }
    if (node.value[dim] > point[dim]) node.left = this.removeHelper(node.left, point, depth + 1);
    else if (node.value[dim] < point[dim]) node.right = this.removeHelper(node.right, point, depth + 1);
    else{
      if(this.containsHelper(point, node.left, depth + 1)) node.left = this.removeHelper(node.left, point, depth + 1);
      if(this.containsHelper(point, node.right, depth + 1)) node.right = this.removeHelper(node.right, point, depth + 1);
    }
     return node;
   }

  this.remove = function(point){
    this.length--;
    this.root = this.removeHelper(this.root, point, 0);
    return this;
  }
   
   this.inorderHelper = function(node, depth){
     if (Boolean(node)){
       this.inorderHelper(node.left, depth + 1);
       for (var i = 0; i < depth; i++) document.write("---");
       document.write(" " + node.value + "<br>");
       this.inorderHelper(node.right, depth + 1);
     }
   }
   
   this.inorder = function(){
     this.inorderHelper(this.root, 0);
     return this;
   }
   
   this.preorderHelper = function(node, meth, args){
     if (Boolean(node)){
       node.value[meth](args);
       this.preorderHelper(node.left, meth, args);
       this.preorderHelper(node.right, meth, args);
     }
   }
   
   this.preorder = function(meth, args){
    this.preorderHelper(this.root, meth, args);
    return this;
   }
   
   this.length = points.length;
  this.root = this.create(points, 0);
}