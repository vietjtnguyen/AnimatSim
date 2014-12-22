var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var _ = require('lodash');

describe('The Population module', function() {
  var Population = require('../src/js/Population');
  it('should contain the Population class', function() {
    expect(Population.name).to.equal('Population');
    var population = new Population();
    expect(population).to.exist();
  });

  describe('The Population class', function() {
    it('should start off empty');
    it('should add invidual animats through the add method');
    it('should populate appropriately using the populate method');
    it('should move all animats from alive to dead using the killAll method');
    it('should move all animats from dead to alive and reset their states using the reset method');
    it('should call step on all alive animats when performing a simulation step');
  });
});
