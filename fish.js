function fish(){
  this.fitness = 1;
  this.position = new vector2d(Math.random() * screenWidth, Math.random() * screenHeight);
  this.rotation = Math.random() * 2.0 * Math.PI;
  this.look = new vector2d(0, 0);
  this.look.setAngleVector(1.0, this.rotation); 
  this.speed = Math.random() * 2.0;
  this.brain = new neuralNetwork(4, 2, 1, 6, -1.0, 1.0);
  this.turn = 0;
  this.color = Math.random();
  this.dead = false;
  this.features = {horn_len : 15,
				   body_size : 10,
  				   tail : (Math.random() * 15 + 1)
  };
  
  this.draw = function(ctx){
    if (this.dead) return;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(1 + this.fitness / 10, 1 + this.fitness / 10);
    ctx.rotate(this.rotation);
    var colour = Math.floor(this.color * 510);
    if (colour - 255 > 0){
      style = (colour-255) > 0xF ? "#" + (colour-255).toString(16) + "0000" : "#0" + (colour-255).toString(16) + "0000";
    }
    else{
       style = (255-colour) > 0xF ? "#0000" + (255-colour).toString(16) : "#00000" + (255-colour).toString(16);    
    }
    ctx.fillStyle = style;
    // Draw body.
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI, false);
    ctx.lineTo(0, -16);
    ctx.lineTo(4, 0);
    ctx.fill();
    // Draw eyes.
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(1.75, 0.5, 0.75, 0, 2*Math.PI, false);
    ctx.arc(-1.75, 0.5, 0.75, 0, 2*Math.PI, false);
    ctx.fill();
    // Horn
    ctx.save();
    ctx.strokeStyle = style;
    //ctx.translate(3.5, 0);
    ctx.rotate(-1 * this.turn);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.features.horn_len);
	/*ctx.moveTo(0, 0);
	ctx.lineTo(5, 10);
	ctx.moveTo(0, 0);
	ctx.lineTo(-5, 10);
	ctx.moveTo(0, 0);
	ctx.lineTo(10, 10);
	ctx.moveTo(0, 0);
	ctx.lineTo(-10, 10);*/
    ctx.stroke();
    ctx.restore();
    // Draw left fin.
    ctx.save();
    ctx.strokeStyle = style;
    ctx.translate(3.5, 0);
    ctx.rotate(-1 * this.turn);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -14.5);
    ctx.stroke();
    ctx.restore();
    // Draw right fin.
    ctx.save();
    ctx.strokeStyle = style;
    ctx.translate(-3.5, 0);
    ctx.rotate(-1 * this.turn);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -14.5);
    ctx.stroke();
    ctx.restore();
    // Draw tail
    ctx.save();
    ctx.translate(0, -15);
    ctx.rotate(this.turn * -3.5 + 0.3 * this.speed * Math.sin(genTime / 2));
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.features.tail);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
  
  this.erase = function(ctx){
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(1 + this.fitness / 150, 1 + this.fitness / 150);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "white";
    ctx.fillRect(-10, -21, 20, 26);
    ctx.restore();
  }
  
  this.isInteriorPoint = function(ctx, x, y){
    if (this.dead) return false;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(1 + this.fitness / 150, 1 + this.fitness / 150);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI, false);
    ctx.lineTo(0, -16);
    ctx.lineTo(4, 0);
    ctx.restore();
    return ctx.isPointInPath(x, y);
  }
  
  this.closest = function(objects){
    var minSqrDist = 10000000000;
    var minObject = null;
    for (var i in objects) if ((objects[i] != this) && (!objects[i].dead)){
      var sqrDist = this.position.distanceSquared(objects[i].position);
      if (minSqrDist > sqrDist){
        minSqrDist = sqrDist;
        minObject = objects[i];
      }
    }
    return [minObject, minSqrDist];
  }
  
  this.update = function(planktons, fishs){
    if (this.dead) return;
    while(true){
      var nearestAndDist = planktons.nearestNeighbor(this.position);
      var nearest = nearestAndDist[0];
      if (Math.sqrt(nearestAndDist[1]) <= 2 + 4 * (1 + this.fitness / 150)){
        this.fitness++;
        planktons.remove(nearest);
        if(regenerateFood) planktons.insert(new plankter());
      }
      else break;
    }
	  
	this.updateFitness = function()
	{
		// The faster the fish, the more consumed energy
		this.fitness -= Math.exp(this.features.tail) * 0.000001;
		if (this.fitness < 0)
			this.fitness = 0;
		//	this.dead = true;
	}
    //var nearestAndDistFish = this.closest(fishs);
    //var closestFish = this.position.sub(nearestAndDistFish[0].position);
    
    var closestObject = this.position.sub(nearest).normalize();
    //var inputs = [closestObject.x, closestObject.y, this.look.x, this.look.y, closestFish.x, closestFish.y];
    var inputs = [closestObject.x, closestObject.y, this.look.x, this.look.y];
    var outputs = this.brain.update(inputs);
    this.turn = clamp(outputs[0] - outputs[1], 0.3, -0.3);
    this.rotation += this.turn;
    if (this.rotation > 2.0 * Math.PI) this.rotation -= 2.0 * Math.PI;
    if (this.rotation < 0.0) this.rotation += 2.0 * Math.PI;
    //this.speed = outputs[0] + outputs[1];
	this.speed = this.calculateSpeed(outputs[0] + outputs[1]);
    this.look.setAngleVector(1.0, this.rotation);
    this.position = this.position.add(this.look.scale(this.speed));
    if (this.position.x > screenWidth) this.position.x -= screenWidth;
    if (this.position.x < 0) this.position.x += screenWidth;
    if (this.position.y > screenHeight) this.position.y -= screenHeight;
    if (this.position.y < 0) this.position.y += screenHeight;
    
    maxFitness = Math.max(this.fitness, maxFitness);
    minFitness = Math.min(this.fitness, minFitness);
  }
  
  this.getGenome = function(){
    var genome = this.brain.getWeights();
    genome.push(this.color);
    return genome;
  }

  this.calculateSpeed = function(baseSpeed){
	  return baseSpeed * this.features.tail / 10;
  }
}
 
function compareFish(a, b){
  return a.fitness - b.fitness;
}