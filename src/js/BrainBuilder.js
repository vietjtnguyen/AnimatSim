var _ = require('./util');

var Neuron = require('./Neuron');

function BrainBuilder()
{
  var self = this;
  self.neurons = [];
  self.groups = {};
  self.namedNeurons = {};
  self.unnamedNeurons = [];
}

BrainBuilder.prototype.addNamedNeurons = function(inputNames, group, neuronFactory)
{
  inputNames.forEach(function(name) {
    var neuron = neuronFactory();
    self.neurons.push(neuron);
    if ( !self.groups.hasOwnProperty(group) )
    {
      self.groups[group] = [];
    }
    self.groups[name].push(neuron);
    self.namedNeurons[name] = neuron;
  });
};

BrainBuilder.prototype.addUnnamedNeurons = function(numToAdd, group, neuronFactory)
{
  var i;
  var neuron;
  for ( i = 0; i < numToAdd; i += 1)
  {
    neuron = neuronFactory();
    self.neurons.push(neuron);
    if ( !self.groups.hasOwnProperty(group) )
    {
      self.groups[group] = [];
    }
    self.groups[name].push(neuron);
    self.unnamedNeurons.push(neuron);
  }
};

BrainBuilder.prototype.toBrain = function()
{
};

module.exports = BrainBuilder;
