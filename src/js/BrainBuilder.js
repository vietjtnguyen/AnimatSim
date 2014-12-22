var _ = require('./util');

var Brain = require('./Brain');

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
  var self = this;
  inputNames.forEach(function(name) {
    var neuron = neuronFactory();
    self.neurons.push(neuron);
    if ( !self.groups.hasOwnProperty(group) )
    {
      self.groups[group] = [];
    }
    self.groups[group].push(neuron);
    self.namedNeurons[name] = neuron;
  });
};

BrainBuilder.prototype.addUnnamedNeurons = function(numToAdd, group, neuronFactory)
{
  var self = this;
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
    self.groups[group].push(neuron);
    self.unnamedNeurons.push(neuron);
  }
};

/**
 * Connects the neurons added thus far in a complete manner (i.e. complete
 * graph) meaning all neurons are connected to all neurons (i.e. all neurons
 * use all other neurons as input). However, any groups specified in
 * `groupsToNotConnect` will not create any connections (i.e. have no inputs)
 * but will still act as inputs for other neurons. This behavior exists because
 * input neurons (e.g. sensors, internal state) are *set* by animats directly.
 */
BrainBuilder.prototype.connectComplete = function(groupsToNotConnect)
{
  var self = this;
  groupsToNotConnect = groupsToNotConnect || [];
  var groupNames = _.difference(_.keys(self.groups), groupsToNotConnect);
  groupNames.forEach(function(groupName) {
    self.groups[groupName].forEach(function(neuron) {
      self.neurons.forEach(function(inNeuron) {
        if ( neuron !== inNeuron )
        {
          neuron.connect(inNeuron, _.random());
        }
      });
    });
  });
};

BrainBuilder.prototype.toBrain = function()
{
  var self = this;
  var brain = new Brain();
  brain.neurons = self.neurons;
  _.forEach(self.namedNeurons, function(name, neuron) {
    brain[name] = neuron;
  });
  return brain;
};

module.exports = BrainBuilder;
