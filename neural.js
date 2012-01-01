function neuron(numInputs){
  this.weights = new Array();
  for (var i = 0; i < numInputs + 1; i++) 
  {
	this.weights.push(Math.random() * 2.0 - 1.0);
  }
}

function neuronLayer(numNeurons, numInputs){
  this.neurons = new Array();
  for (var i = 0; i < numNeurons; i++) this.neurons.push(new neuron(numInputs));
}

function neuralNetwork(numInputs, numOutputs, numHiddenLayers, numPerHiddenLayer, bias, activationResponse){
  this.numInputs = numInputs;
  this.numOutputs = numOutputs;
  this.numHiddenLayers = numHiddenLayers;
  this.numPerHiddenLayer = numPerHiddenLayer;
  this.bias = bias;
  this.activationResponse = activationResponse;
  this.layers = new Array();
  if (numHiddenLayers){
    this.layers.push(new neuronLayer(numPerHiddenLayer, numInputs));
    for (var i = 0; i < numHiddenLayers - 1; i++) this.layers.push(new neuronLayer(numPerHiddenLayer, numPerHiddenLayer));
    this.layers.push(new neuronLayer(numOutputs, numPerHiddenLayer));
  }
  else{
    this.layers.push(new neuronLayer(numOutputs, numInputs));
  }
  
  this.getWeights = function(){
    var weights = new Array();
    for (var i in this.layers){  
      for (var j in this.layers[i].neurons){
        for (var k in this.layers[i].neurons[j].weights){
          weights.push(this.layers[i].neurons[j].weights[k]);
        }
      }
    }
    return weights;
  }
  
  this.setWeights = function(weights){
    var w = 0;
    for (var i in this.layers){  
      for (var j in this.layers[i].neurons){
        for (var k in this.layers[i].neurons[j].weights){
          this.layers[i].neurons[j].weights[k] = weights[w];
          w++;
        }
      }
    }
    return this;
  }
  
  this.getNumWeights = function(){
    var total = 0;
    for (var i in this.layers){  
      for (var j in this.layers[i].neurons){
        for (var k in this.layers[i].neurons[j].weights){
          total++;
        }
      }
    }
    return total;
  }
  
  this.update = function(inputs){
    var outputs = new Array();
    if (inputs.length != this.numInputs){
      alert("Error: The given number of update inputs does not match the nueral networks number.");
    }
    else{
      for (var i = 0; i < this.layers.length; i++){
        if (i > 0){
          inputs = outputs;
          outputs = new Array();
        }
        for (var j in this.layers[i].neurons){
          var netInput = 0.0;
          for (var k = 0; k < this.layers[i].neurons[j].weights.length - 1; k++){
            netInput += this.layers[i].neurons[j].weights[k] * inputs[k];
          }
          netInput += this.layers[i].neurons[j].weights[this.layers[i].neurons[j].weights.length - 1] * this.bias;
          outputs.push(sigmoid(netInput, this.activationResponse));
        }
      }
    }
    return outputs;
  }
}