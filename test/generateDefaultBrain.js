var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var _ = require('lodash');

describe('The generateDefaultBrain module', function() {
  var generateDefaultBrain = require('../src/js/generateDefaultBrain');
  it('should contain a function', function() {
    expect(_.isFunction(generateDefaultBrain)).to.be.true();
  });

  describe('The generateDefaultBrain function', function() {
    it('should return a Brain object', function() {
      var Brain = require('../src/js/Brain');
      var brain = generateDefaultBrain();
      expect(brain).to.be.instanceof(Brain);
    });
    it('should generate a Brain object with 63 neurons', function() {
      var brain = generateDefaultBrain();
      expect(brain.neurons.length).to.equal(63);
    });
  });
});


