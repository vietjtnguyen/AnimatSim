var _ = require('./util');

var Brain = require('./Brain');
var BrainBuilder = require('./BrainBuilder');
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
  var group, neuronFactory;
  var brainBuilder = new BrainBuilder();
  brainBuilder.version = 'default_v1';

  var sensorNames = [
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
  group = 'sensors';
  neuronFactory = function() { return createStandardNeuron(1.0); };
  brainBuilder.addNamedNeurons(sensorNames, group, neuronFactory);

  // Internal state
  var internalStateNames = [
    'swimming',
    'energyLow',
    'energyHigh',
    'energyLevel',
    'energyChange',
    'stomach',
    'avoidance'
  ];
  group = 'internalState';
  neuronFactory = function() { return createStandardNeuron(1.0); };
  brainBuilder.addNamedNeurons(internalStateNames, group, neuronFactory);
  
  // Create output neurons.
  var outputNames = [
    'leanLeft',
    'turnLeft',
    'leanRight',
    'turnRight',
    'walkForward',
    'runForward',
    'eat'
  ];
  group = 'output';
  neuronFactory = function() { return createStandardNeuron(1.0); };
  brainBuilder.addNamedNeurons(outputNames, group, neuronFactory);

  // Create excitatory neurons.
  group = 'excitatory';
  neuronFactory = function() { return createStandardNeuron(1.0); };
  brainBuilder.addUnnamedNeurons(10, group, neuronFactory);

  // Create inhibitory neurons.
  group = 'inhibitory';
  neuronFactory = function() { return createStandardNeuron(-1.0); };
  brainBuilder.addUnnamedNeurons(10, group, neuronFactory);

  brainBuilder.connectComplete(['input', 'internalState']);

  var brain = brainBuilder.toBrain();
  brain.randomizeNeuronOutputs();

  return brain;
};

