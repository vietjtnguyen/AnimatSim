var _ = require('./util');

var Neuron = require('./Neuron');

/**
 * @classdesc
 * @class
 */
var Brain = function()
{
  // TODO: This distinction between input and non input neurons isn't actually used anywhere.
  this.inputNeurons = [];
  this.nonInputNeurons = [];
};

/**
 */
Brain.prototype.addInputNeuron = function(neuron)
{
  return this.inputNeurons.push(neuron);
};

/**
 */
Brain.prototype.addNonInputNeuron = function(neuron)
{
  return this.nonInputNeurons.push(neuron);
};

/**
 */
Brain.prototype.step = function()
{
  var i;
  // Only non-input neurons process their inputs because input neurons have
  // their input set by the animat's sensors
  for( i = 0; i < this.nonInputNeurons.length; i += 1 )
  {
    this.nonInputNeurons[i].processInput();
  }

  // All neurons fire.
  for( i = 0; i < this.inputNeurons.length; i += 1 )
  {
    this.inputNeurons[i].fire();
  }
  for( i = 0; i < this.nonInputNeurons.length; i += 1 )
  {
    this.nonInputNeurons[i].fire();
  }
};

// Right now I cheat because I have a set topology so this genome-making
// process ensures the neurons represent the same thing in the same order
// simply via consistent construction.
/**
 */
Brain.prototype.toGenome = function()
{
  var i;
  var genome = [];
  for( i = 0; i < this.inputNeurons.length; i += 1 )
  {
    genome.push(this.inputNeurons[i].toGene());
  }
  for( i = 0; i < this.nonInputNeurons.length; i += 1 )
  {
    genome.push(this.nonInputNeurons[i].toGene());
  }
  return genome;
};

/**
 */
Brain.prototype.fromGenome = function(genome)
{
  var i;
  for( i = 0; i < this.inputNeurons.length; i += 1 )
  {
    this.inputNeurons[i].fromGene(genome[i]);
  }
  for( i = 0; i < this.nonInputNeurons.length; i += 1 )
  {
    this.nonInputNeurons[i].fromGene(genome[i + this.inputNeurons.length]);
  }
};

/**
 */
Brain.mixGenomes = function(genomeA, genomeB, crossOverRate, mutationRate, geneCrossOverRate, geneMutationRate)
{
  var genome = [];
  var operator = _.random(0, 2);
  var crossOverChance = 0.0;
  for( var i = 0; i < genomeA.length; i++ )
  {
    var geneA = genomeA[i],
      geneB = genomeB[i],
      gene = null;

    crossOverChance += crossOverRate;
    if( Math.random() < crossOverChance )
    {
      operator = _.random(0, 2);
      crossOverChance = 0.0;
    }
    switch( operator )
    {
    case 0: // use A
      gene = geneA.slice(0);
      break;

    case 1: // use b
      gene = geneB.slice(0);
      break;

    default: // mix
      gene = Neuron.mixGenes(geneA, geneB, geneCrossOverRate, geneMutationRate);
      break;
    }

    if( Math.random() < mutationRate )
    {
      gene = Neuron.mutateGene(gene);
    }

    genome.push(gene);
  }

  return genome;
};

/**
 */
Brain.markI = function()
{
  var neuronIndex = -1;
  function createStandardNeuron(sign)
  {
    //sign, threshold, domainScale, stochasticity
    neuronIndex += 1;
    return new Neuron(neuronIndex, sign, _.random(0.2, 1.0), _.random(0.1, 2.0), _.random(0.0, 1.0));
  }
    
  var brain = new Brain();
  brain.version = 'markI';

  // Create input neurons.
  var inputNeurons = [];

  // Sensors
  inputNeurons.push(brain.leftSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.temperature = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.moisture = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.vegetation = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardVegetationGradient = createStandardNeuron(1.0));

  // Internal state
  inputNeurons.push(brain.swimming = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyLow = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyHigh = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyLevel = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyChange = createStandardNeuron(1.0));
  inputNeurons.push(brain.stomach = createStandardNeuron(1.0));
  inputNeurons.push(brain.avoidance = createStandardNeuron(1.0));
  
  // Create output neurons.
  var outputNeurons = [];
  outputNeurons.push(brain.leanLeft = createStandardNeuron(1.0));
  outputNeurons.push(brain.turnLeft = createStandardNeuron(1.0));
  outputNeurons.push(brain.leanRight = createStandardNeuron(1.0));
  outputNeurons.push(brain.turnRight = createStandardNeuron(1.0));
  outputNeurons.push(brain.walkForward = createStandardNeuron(1.0));
  outputNeurons.push(brain.runForward = createStandardNeuron(1.0));
  outputNeurons.push(brain.eat = createStandardNeuron(1.0));

  // Create hidden neurons.
  var i, j;
  var hiddenNeurons = [];
  var numOfHiddenExcitatoryNeurons = 10;
  var numOfHiddenInhibitoryNeurons = 10;
  for( i = 0; i < numOfHiddenExcitatoryNeurons; i += 1 )
  {
    hiddenNeurons.push(createStandardNeuron(1.0));
  }
  for( i = 0; i < numOfHiddenInhibitoryNeurons; i += 1 )
  {
    hiddenNeurons.push(createStandardNeuron(-1.0));
  }
  
  // Add neurons to all list and brain.
  var allNeurons = [];
  for( i = 0; i < inputNeurons.length; i += 1 )
  {
    allNeurons.push(inputNeurons[i]);
    brain.addInputNeuron(inputNeurons[i]);
  }
  for( i = 0; i < outputNeurons.length; i += 1 )
  {
    allNeurons.push(outputNeurons[i]);
    brain.addNonInputNeuron(outputNeurons[i]);
  }
  for( i = 0; i < hiddenNeurons.length; i += 1 )
  {
    allNeurons.push(hiddenNeurons[i]);
    brain.addNonInputNeuron(hiddenNeurons[i]);
  }

  // Connect neurons together. Input neurons do not connect with other
  // neurons. All other neurons connect with every other neuron.
  for( i = 0; i < brain.nonInputNeurons.length; i += 1 )
  {
    var nonInputNeuron = brain.nonInputNeurons[i];
    nonInputNeuron.output = Math.random(); // random seed, not sure how important this is
    for( j = 0; j < allNeurons.length; j += 1 )
    {
      var otherNeuron = allNeurons[j];
      if( nonInputNeuron != otherNeuron )
      {
        nonInputNeuron.connect(otherNeuron, Math.random() * 1.0);
      }
    }
  }

  return brain;
};

/**
 */
Brain.markII = function()
{
  var neuronIndex = -1;
  function createStandardNeuron(sign)
  {
    //sign, threshold, domainScale, stochasticity
    neuronIndex += 1;
    return new Neuron(neuronIndex, sign, _.random(0.2, 1.0), _.random(0.1, 2.0), _.random(0.0, 1.0));
  }
    
  var brain = new Brain();
  brain.version = 'markII';

  // Create input neurons.
  var inputNeurons = [];

  // Sensors
  inputNeurons.push(brain.altitude = createStandardNeuron(1.0));
  inputNeurons.push(brain.farAltitude = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.temperature = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.moisture = createStandardNeuron(1.0));
  inputNeurons.push(brain.farWater = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.vegetation = createStandardNeuron(1.0));
  inputNeurons.push(brain.farVegetation = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.animatDensity = createStandardNeuron(1.0));
  inputNeurons.push(brain.farAnimatDensity = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardAnimatDensityGradient = createStandardNeuron(1.0));

  // Internal state
  inputNeurons.push(brain.swimming = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyLow = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyHigh = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyLevel = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyChange = createStandardNeuron(1.0));
  inputNeurons.push(brain.stomach = createStandardNeuron(1.0));
  inputNeurons.push(brain.avoidance = createStandardNeuron(1.0));
  
  // Create output neurons.
  var outputNeurons = [];
  outputNeurons.push(brain.leanLeft = createStandardNeuron(1.0));
  outputNeurons.push(brain.turnLeft = createStandardNeuron(1.0));
  outputNeurons.push(brain.leanRight = createStandardNeuron(1.0));
  outputNeurons.push(brain.turnRight = createStandardNeuron(1.0));
  outputNeurons.push(brain.walkForward = createStandardNeuron(1.0));
  outputNeurons.push(brain.runForward = createStandardNeuron(1.0));
  outputNeurons.push(brain.eat = createStandardNeuron(1.0));

  // Create hidden neurons.
  var i;
  var hiddenNeurons = [];
  var numOfHiddenExcitatoryNeurons = 14;
  var numOfHiddenInhibitoryNeurons = 15;
  for( i = 0; i < numOfHiddenExcitatoryNeurons; i += 1 )
  {
    hiddenNeurons.push(createStandardNeuron(1.0));
  }
  for( i = 0; i < numOfHiddenInhibitoryNeurons; i += 1 )
  {
    hiddenNeurons.push(createStandardNeuron(-1.0));
  }
  
  // Add neurons to all list and brain.
  var allNeurons = [];
  for( i = 0; i < inputNeurons.length; i += 1 )
  {
    allNeurons.push(inputNeurons[i]);
    brain.addInputNeuron(inputNeurons[i]);
  }
  for( i = 0; i < outputNeurons.length; i += 1 )
  {
    allNeurons.push(outputNeurons[i]);
    brain.addNonInputNeuron(outputNeurons[i]);
  }
  for( i = 0; i < hiddenNeurons.length; i += 1 )
  {
    allNeurons.push(hiddenNeurons[i]);
    brain.addNonInputNeuron(hiddenNeurons[i]);
  }

  // Connect neurons together. Input neurons do not connect with other
  // neurons. All other neurons connect with every other neuron.
  for( i = 0; i < brain.nonInputNeurons.length; i += 1 )
  {
    var nonInputNeuron = brain.nonInputNeurons[i];
    nonInputNeuron.output = Math.random(); // random seed, not sure how important this is
    for( var j = 0; j < allNeurons.length; j += 1 )
    {
      var otherNeuron = allNeurons[j];
      if( nonInputNeuron != otherNeuron )
      {
        nonInputNeuron.connect(otherNeuron, Math.random() * 1.0);
      }
    }
  }

  return brain;
};

/**
 */
Brain.markIIb = function()
{
  var neuronIndex = -1;
  function createStandardNeuron(sign)
  {
    //sign, threshold, domainScale, stochasticity
    neuronIndex += 1;
    return new Neuron(neuronIndex, sign, _.random(0.2, 1.0), _.random(0.1, 2.0), _.random(0.0, 1.0));
  }
    
  var brain = new Brain();
  brain.version = 'markIIb';

  // Create input neurons.
  var inputNeurons = [];

  // Sensors
  inputNeurons.push(brain.altitude = createStandardNeuron(1.0));
  inputNeurons.push(brain.farAltitude = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brain.temperature = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.moisture = createStandardNeuron(1.0));
  inputNeurons.push(brain.farWater = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.vegetation = createStandardNeuron(1.0));
  inputNeurons.push(brain.farVegetation = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.animatDensity = createStandardNeuron(1.0));
  inputNeurons.push(brain.farAnimatDensity = createStandardNeuron(1.0));
  inputNeurons.push(brain.leftAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.rightAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.forwardAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brain.backwardAnimatDensityGradient = createStandardNeuron(1.0));

  // Internal state
  inputNeurons.push(brain.swimming = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyLow = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyHigh = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyLevel = createStandardNeuron(1.0));
  inputNeurons.push(brain.energyChange = createStandardNeuron(1.0));
  inputNeurons.push(brain.stomach = createStandardNeuron(1.0));
  inputNeurons.push(brain.avoidance = createStandardNeuron(1.0));
  
  // Create output neurons.
  var outputNeurons = [];
  outputNeurons.push(brain.leanLeft = createStandardNeuron(1.0));
  outputNeurons.push(brain.turnLeft = createStandardNeuron(1.0));
  outputNeurons.push(brain.leanRight = createStandardNeuron(1.0));
  outputNeurons.push(brain.turnRight = createStandardNeuron(1.0));
  outputNeurons.push(brain.walkForward = createStandardNeuron(1.0));
  outputNeurons.push(brain.runForward = createStandardNeuron(1.0));
  outputNeurons.push(brain.eat = createStandardNeuron(1.0));

  // Create hidden neurons.
  var i;
  var hiddenNeurons = [];
  var numOfHiddenExcitatoryNeurons = 0;
  var numOfHiddenInhibitoryNeurons = 0;
  for( i = 0; i < numOfHiddenExcitatoryNeurons; i += 1 )
  {
    hiddenNeurons.push(createStandardNeuron(1.0));
  }
  for( i = 0; i < numOfHiddenInhibitoryNeurons; i += 1 )
  {
    hiddenNeurons.push(createStandardNeuron(-1.0));
  }
  
  // Add neurons to all list and brain.
  var allNeurons = [];
  for( i = 0; i < inputNeurons.length; i += 1 )
  {
    allNeurons.push(inputNeurons[i]);
    brain.addInputNeuron(inputNeurons[i]);
  }
  for( i = 0; i < outputNeurons.length; i += 1 )
  {
    allNeurons.push(outputNeurons[i]);
    brain.addNonInputNeuron(outputNeurons[i]);
  }
  for( i = 0; i < hiddenNeurons.length; i += 1 )
  {
    allNeurons.push(hiddenNeurons[i]);
    brain.addNonInputNeuron(hiddenNeurons[i]);
  }

  // Connect neurons together. Input neurons do not connect with other
  // neurons. All other neurons connect with every other neuron.
  for( i = 0; i < brain.nonInputNeurons.length; i += 1 )
  {
    var nonInputNeuron = brain.nonInputNeurons[i];
    nonInputNeuron.output = Math.random(); // random seed, not sure how important this is
    for( var j = 0; j < allNeurons.length; j += 1 )
    {
      var otherNeuron = allNeurons[j];
      if( nonInputNeuron != otherNeuron )
      {
        nonInputNeuron.connect(otherNeuron, Math.random() * 1.0);
      }
    }
  }

  return brain;
};

module.exports = Brain;

