function mutate(genome, mutationRate, maxPerturbation){
  for (var i in genome){
    if (Math.random() < mutationRate){
      genome[i] += (Math.random() * 2.0 - 1.0) * maxPerturbation;
    }
  }
}
 
function crossover(genome1, genome2, crossoverRate){
  if (Math.random() < crossoverRate){
    var crossoverPoint = Math.random() * (genome1.length - 1);
    for (var i = 0; i < crossoverPoint; i++){
      var temp = genome1[i];
      genome1[i] = genome2[i];
      genome2[i] = temp;
    }
  }
}

function selectFish(parents, totalFitness){
  var slice = Math.random() * totalFitness;
  for (var i = 0, sum = 0; i < parents.length; i++){
    sum += parents[i].fitness;
    if (sum >= slice) return parents[i];
  }
  return null;
}
 

function Incubator()
{
	this.cross = function(feat1, feat2)
	{
		//for (var i = 0; i < feat1.length; i++)
		//{
			feat1.horn_len = (feat1.horn_len + feat2.horn_len) / 2;
			feat1.tail = (feat1.tail + feat2.tail) / 2;
			//feat2.horn_len = (feat3.horn_len + feat4.horn_len) / 2;
			//feat2.tail = (feat3.tail + feat4.tail) / 2;
		//}
		return new Array(feat1, feat1);
	}
	this.mutate = function(feat, factor)
	{
		// @todo make the randomization relative to the value
		feat.horn_len += factor * (Math.random() * 2.0 - 1.0);
		feat.tail += factor * (Math.random() * 2.0 - 1.0);
		if (feat.tail < 0)
			feat.tail = 0;
		return feat;
	}

	this.mate = function(fish1, fish2)
	{
		var result = this.cross(fish1.features, fish2.features);
		fish1.features = result[0];
		fish2.features = result[1];
		fish1.features = this.mutate(fish1.features, 1);
		fish2.features = this.mutate(fish2.features, 1);
		return new Array(fish1, fish2);
	}
}

function nextGen(){
  var genomes = new Array();
  var features = new Array();
  generation++;
  totalFitness = 0;
  for (var i in fishes)
	  totalFitness += fishes[i].fitness;
  // The 2 fittest fishes are saved ? But fishes are only sorted by pairs
  fishes.sort(compareFish);
  genomes.push(fishes[fishes.length - 1].getGenome());
  genomes.push(fishes[fishes.length - 2].getGenome());
  //features.push(incubator.)
  incubator = new Incubator();
  var feats = incubator.mate(fishes[fishes.length - 1], fishes[fishes.length - 2]);
  features.push(feats[0].features);
  features.push(feats[1].features);
  for (var i = 2; i < fishes.length; i += 2){
    var fish1 = selectFish(fishes, totalFitness);
	var fish2 = selectFish(fishes, totalFitness);
	var genome1 = fish1.getGenome();
    var genome2 = fish2.getGenome();
    crossover(genome1, genome2, 0.7);
    mutate(genome1, 0.1, 0.3);
    mutate(genome2, 0.1, 0.3);
    genomes.push(genome1);
    genomes.push(genome2);
	feats = incubator.mate(fish1, fish2);
	features.push(feats[0].features);
	features.push(feats[1].features);
  }
  //console.log(features);
  for (var i = 0; i < fishes.length; i++){
    fishes[i].color = clamp(genomes[i].pop(), 1, 0);
    fishes[i].brain.setWeights(genomes[i]);
    fishes[i].fitness = 0;
    fishes[i].dead = false;
	fishes[i].features = features[i];
  }
  for (var i = plankton.length; i < numPlankton; i++)  
	plankton.insert(new plankter());
  if (regenerateFood) 
	dataHistory.push(totalFitness);
  else 
	dataHistory.push(genTime);
}