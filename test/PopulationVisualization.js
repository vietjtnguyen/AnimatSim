var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var _ = require('lodash');

describe('The PopulationVisualization module', function() {
  var PopulationVisualization = require('../src/js/PopulationVisualization');
  it('should contain the PopulationVisualization class', function() {
    expect(PopulationVisualization.name).to.equal('PopulationVisualization');
    var populationVisualization = new PopulationVisualization();
    expect(populationVisualization).to.exist();
  });

  describe('The PopulationVisualization class', function() {
    it('should start off empty');
    it('should add invidual animats through the add method');
    it('should populate appropriately using the populate method');
    it('should move all animats from alive to dead using the killAll method');
    it('should move all animats from dead to alive and reset their states using the reset method');
    it('should call step on all alive animats when performing a simulation step');
  });
});

