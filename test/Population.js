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
  });
});

