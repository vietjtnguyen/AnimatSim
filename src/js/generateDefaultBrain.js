var _ = require('./util');

var Brain = require('./Brain');
var Neuron = require('./Neuron');

function createStandardNeuron(sign)
{
  var threshold = _.random(0.2, 1.0);
  var domainScale = _.random(0.1, 2.0);
  var stochasticity = _.random(0.0, 1.0);
  return new Neuron(sign, threshold, domainScale, stochasticity);
}

/**
 */
module.exports = function()
{
  var brainBuilder = new BrainBuilder();
  brainBuilder.version = 'default_v1';

  var inputNames = [
    'altitude',
    'farAltitude',
    'leftSlope',
    'rightSlope',
    'forwardSlope',
    'backwardSlope',
    'temperature',
    'leftTemperatureGradient',
    'rightTemperatureGradient',
    'forwardTemperatureGradient',
    'backwardTemperatureGradient',
    'moisture',
    'farWater',
    'leftMoistureGradient',
    'rightMoistureGradient',
    'forwardMoistureGradient',
    'backwardMoistureGradient',
    'vegetation',
    'farVegetation',
    'leftVegetationGradient',
    'rightVegetationGradient',
    'forwardVegetationGradient',
    'backwardVegetationGradient',
    'animatDensity',
    'farAnimatDensity',
    'leftAnimatDensityGradient',
    'rightAnimatDensityGradient',
    'forwardAnimatDensityGradient',
    'backwardAnimatDensityGradient'
  ];

  // Create input neurons.
  var inputNeurons = [];

  // Sensors
  inputNeurons.push(brainBuilder.altitude = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.farAltitude = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.leftSlope = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.rightSlope = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.forwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.backwardSlope = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.temperature = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.leftTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.rightTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.forwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.backwardTemperatureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.moisture = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.farWater = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.leftMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.rightMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.forwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.backwardMoistureGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.vegetation = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.farVegetation = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.leftVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.rightVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.forwardVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.backwardVegetationGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.animatDensity = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.farAnimatDensity = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.leftAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.rightAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.forwardAnimatDensityGradient = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.backwardAnimatDensityGradient = createStandardNeuron(1.0));

  // Internal state
  inputNeurons.push(brainBuilder.swimming = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.energyLow = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.energyHigh = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.energyLevel = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.energyChange = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.stomach = createStandardNeuron(1.0));
  inputNeurons.push(brainBuilder.avoidance = createStandardNeuron(1.0));
  
  // Create output neurons.
  var outputNeurons = [];
  outputNeurons.push(brainBuilder.leanLeft = createStandardNeuron(1.0));
  outputNeurons.push(brainBuilder.turnLeft = createStandardNeuron(1.0));
  outputNeurons.push(brainBuilder.leanRight = createStandardNeuron(1.0));
  outputNeurons.push(brainBuilder.turnRight = createStandardNeuron(1.0));
  outputNeurons.push(brainBuilder.walkForward = createStandardNeuron(1.0));
  outputNeurons.push(brainBuilder.runForward = createStandardNeuron(1.0));
  outputNeurons.push(brainBuilder.eat = createStandardNeuron(1.0));

  // Create hidden neurons.
  var i;
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
  
  // Add neurons to all list and brainBuilder.
  var allNeurons = [];
  for( i = 0; i < inputNeurons.length; i += 1 )
  {
    allNeurons.push(inputNeurons[i]);
    brainBuilder.addInputNeuron(inputNeurons[i]);
  }
  for( i = 0; i < outputNeurons.length; i += 1 )
  {
    allNeurons.push(outputNeurons[i]);
    brainBuilder.addNonInputNeuron(outputNeurons[i]);
  }
  for( i = 0; i < hiddenNeurons.length; i += 1 )
  {
    allNeurons.push(hiddenNeurons[i]);
    brainBuilder.addNonInputNeuron(hiddenNeurons[i]);
  }

  // Connect neurons together. Input neurons do not connect with other
  // neurons. All other neurons connect with every other neuron.
  for( i = 0; i < brainBuilder.nonInputNeurons.length; i += 1 )
  {
    var nonInputNeuron = brainBuilder.nonInputNeurons[i];
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

  return brainBuilder;
};

