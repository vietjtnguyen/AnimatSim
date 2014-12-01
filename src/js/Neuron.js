var _ = require('./util');

/**
 */
function simpleSquash(x, a) {
	return (a + 2) * (x - 0.5) / (1 + a * Math.abs(x - 0.5));
}

/**
 */
function simpleNormalizedSquash(x, a) {
	return simpleSquash(x, a) * 0.5 + 0.5;
}

/**
 */
function simpleSigmoid(x) {
	return x / (1.0 + Math.abs(x));
}

/**
 */
function simpleRelu(x) {
  return Math.max(x, 0);
}

/**
 * @classdesc
 * @class
 */
var Neuron = function(index, sign, threshold, domainScale, stochasticity)
{
  this.index = index;
  this.sign = sign;
  this.threshold = threshold;
  this.domainScale = domainScale;
  this.stochasticity = stochasticity;
  this.connections = [];
};

/**
 */
Neuron.prototype.connect = function(neuron, strength)
{
  return this.connections.push({
    neuron: neuron,
    strength: strength,
  });
};


/**
 */
Neuron.prototype.processInput = function()
{
  this.totalInput = 0.0;
  for( var i = 0; i < this.connections.length; i += 1 )
  {
    var connection = this.connections[i];
    this.totalInput += connection.neuron.output * simpleNormalizedSquash(connection.strength, 6.0);
  }
};


/**
 */
Neuron.prototype.setInput = function(value)
{
  this.totalInput = value;
};


/**
 */
Neuron.prototype.fire = function()
{
  if( simpleSigmoid(this.totalInput * this.domainScale) >= this.threshold )
  {
    this.output = this.sign * ((1.0 - this.stochasticity) + Math.random() * this.stochasticity);
  }
  else
  {
    this.output = 0.0;
  }
};

// I don't have to worry about neuronal consistency because the neurons are
// all the same by construction. This isn't ideal.
/**
 */
Neuron.prototype.toGene = function()
{
  var gene = [this.threshold, this.domainScale, this.stochasticity];
  for( var i = 0; i < this.connections.length; i += 1 )
  {
    gene.push(this.connections[i].strength);
  }
  return gene;
};

/**
 */
Neuron.prototype.fromGene = function(gene)
{
  this.threshold = gene[0];
  this.domainScale = gene[1];
  this.stochasticity = gene[2];
  for( var i = 0; i < this.connections.length; i += 1 )
  {
    this.connections[i].strength = gene[3 + i];
  }
};

/**
 */
Neuron.mixGenes = function(geneA, geneB, crossOverRate, mutationRate)
{
  var gene = [];
  var operator = _.random(0, 2);
  var crossOverChance = 0.0;
  for( var i = 0; i < geneA.length; i += 1 )
  {
    var bitA = geneA[i],
      bitB = geneB[i],
      bit = null;

    crossOverChance += crossOverRate;
    if( Math.random() < crossOverChance )
    {
      operator = _.random(0, 2);
      crossOverChance = 0.0;
    }
    switch( operator )
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

    if( Math.random() < mutationRate )
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
  for( var i = 3; i < gene.length; i += 1 )
  {
    mutatedGene[i] = _.random(0.0, 1.0);
  }
  return mutatedGene;
};

module.exports = Neuron;

