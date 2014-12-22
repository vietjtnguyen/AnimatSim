var _ = require('./util');

var Brain = require('./Brain');
var Neuron = require('./Neuron');

/**
 */
module.exports = function()
{
  function createStandardNeuron(sign)
  {
    var threshold = _.random(0.2, 1.0);
    var domainScale = _.random(0.1, 2.0);
    var stochasticity = _.random(0.0, 1.0);
    return new Neuron(sign, threshold, domainScale, stochasticity);
  }
    
  var brain = new Brain();
  brain.version = 'default_v1';

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

