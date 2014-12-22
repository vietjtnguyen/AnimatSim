var _ = require('./util');

/**
 */
function squash(x, a)
{
	return (a + 2) * (x - 0.5) / (1 + a * Math.abs(x - 0.5));
}

/**
 */
function normalizedSquash(x, a)
{
	return squash(x, a) * 0.5 + 0.5;
}

/**
 */
function sigmoid(x)
{
	return x / (1.0 + Math.abs(x));
}

/**
 */
function relu(x) {
  return Math.max(x, 0);
}

/**
 * @classdesc
 * @class
 */
var Neuron = function(sign, threshold, domainScale, stochasticity)
{
  var self = this;
  self.sign = sign;
  self.threshold = threshold;
  self.domainScale = domainScale;
  self.stochasticity = stochasticity;
  self.connections = [];
};

/**
 */
Neuron.prototype.connect = function(neuron, strength)
{
  var self = this;
  return self.connections.push({
    neuron: neuron,
    strength: strength,
  });
};


/**
 * Resets the total input signal to the neuron and sums it up across all
 * connected neurons. If there are no connected neurons (presumably because
 * this is an input neuron which has its input set using the `setInput` method)
 * then the total input is left alone (i.e. not reset).
 */
Neuron.prototype.processInput = function()
{
  var self = this;

  if ( self.connections.length === 0 )
  {
    return;
  }

  self.totalInput = 0.0;
  for ( var i = 0; i < self.connections.length; i += 1 )
  {
    var connection = self.connections[i];
    self.totalInput += connection.neuron.output * connection.strength;
  }
};


/**
 */
Neuron.prototype.setInput = function(value)
{
  var self = this;
  self.totalInput = value;
};


/**
 */
Neuron.prototype.fire = function()
{
  var self = this;
  if( sigmoid(self.totalInput * self.domainScale) >= self.threshold )
  {
    self.output = self.sign * ((1.0 - self.stochasticity) + _.random() * self.stochasticity);
  }
  else
  {
    self.output = 0.0;
  }
};

// I don't have to worry about neuronal consistency because the neurons are
// all the same by construction. This isn't ideal.
/**
 */
Neuron.prototype.toGene = function()
{
  var self = this;
  var gene = [self.threshold, self.domainScale, self.stochasticity];
  for( var i = 0; i < self.connections.length; i += 1 )
  {
    gene.push(self.connections[i].strength);
  }
  return gene;
};

/**
 */
Neuron.prototype.fromGene = function(gene)
{
  var self = this;
  self.threshold = gene[0];
  self.domainScale = gene[1];
  self.stochasticity = gene[2];
  for ( var i = 0; i < self.connections.length; i += 1 )
  {
    self.connections[i].strength = gene[3 + i];
  }
};

/**
 */
Neuron.mixGenes = function(geneA, geneB, crossOverRate, mutationRate)
{
  var gene = [];
  var operator = _.random(0, 2);
  var crossOverChance = 0.0;
  for ( var i = 0; i < geneA.length; i += 1 )
  {
    var bitA = geneA[i],
      bitB = geneB[i],
      bit = null;

    crossOverChance += crossOverRate;
    if ( Math.random() < crossOverChance )
    {
      operator = _.random(0, 2);
      crossOverChance = 0.0;
    }
    switch ( operator )
    {
    case 0: // use A
      bit = bitA;
      break;

    case 1: // use b
      bit = bitB;
      break;

    default: // mix
      var t = _.random(0.3, 0.7);
      bit = bitA * (1.0 - t) + bitB * t;
      break;
    }

    if ( Math.random() < mutationRate )
    {
      bit = bit * _.random(0.5, 1.5);
    }

    gene.push(bit);
  }

  return gene;
};

/**
 */
Neuron.mutateGene = function(gene)
{
  var mutatedGene = new Array(gene.length);
  mutatedGene[0] = _.random(0.2, 1.0);
  mutatedGene[1] = _.random(0.1, 2.0);
  mutatedGene[2] = _.random(0.0, 1.0);
  for ( var i = 3; i < gene.length; i += 1 )
  {
    mutatedGene[i] = _.random(0.0, 1.0);
  }
  return mutatedGene;
};

module.exports = Neuron;

