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
  var self = this;
  return self.inputNeurons.push(neuron);
};

/**
 */
Brain.prototype.addNonInputNeuron = function(neuron)
{
  var self = this;
  return self.nonInputNeurons.push(neuron);
};

Brain.prototype.fullyConnect = function()
{
  var self = this;
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
}

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

module.exports = Brain;

