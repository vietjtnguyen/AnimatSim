var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var _ = require('lodash');

describe('The PopulationVisualization module', function() {
  var Population = require('../src/js/Population');
  var PopulationVisualization = require('../src/js/PopulationVisualization');
  it('should contain the PopulationVisualization class', function() {
    expect(PopulationVisualization.name).to.equal('PopulationVisualization');
    var d3SvgGroup = null;
    var population = new Population();
    var populationVisualization = new PopulationVisualization(d3SvgGroup, population);
    expect(populationVisualization).to.exist();
  });

  describe('The PopulationVisualization class', function() {
    it('should complain if a population is not provided on construction');
  });
});

