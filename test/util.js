var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

describe('The util module', function() {
  var _ = require('../src/js/util');
  var lodash = require('lodash');
  it('should contain all of LoDash\'s properties', function() {
    lodash.forIn(lodash, function(value, key, object) {
      expect(_).to.have.property(key, value);
    });
  });
  it('should contain the clamp and resultObject functions', function() {
    expect(_).to.have.property('clamp');
    expect(_).to.have.property('resultObject');
  });

  describe('The clamp function', function() {
    it('should return the min of the interval for values smaller than the min', function() {
      expect(_.clamp(-1.1, 0.1, 3.34)).to.equal(0.1);
    });
    it('should return the max of the interval for values larger than the max', function() {
      expect(_.clamp(5.123, 0.1, 3.34)).to.equal(3.34);
    });
    it('should return the the value for values within the interval', function() {
      expect(_.clamp(3.14159, 0.1, 3.34)).to.equal(3.14159);
    });
  });

  describe('The incLoop function', function() {
    it('should return the max-1 of the interval for a value at max-2 of the interval', function() {
      expect(_.incLoop(3, 2, 5)).to.equal(4);
    });
    it('should return the min of the interval for a value at max-1 of the interval', function() {
      expect(_.incLoop(4, 2, 5)).to.equal(2);
    });
    it('should return min+1 of the interval for a value at max of the interval', function() {
      expect(_.incLoop(5, 2, 5)).to.equal(3);
    });
    it('should work with negative numbers', function() {
      expect(_.incLoop(-3, -5, -1)).to.equal(-2);
      expect(_.incLoop(-2, -5, -1)).to.equal(-5);
      expect(_.incLoop(-1, -5, -1)).to.equal(-4);
    });
  });

  describe('The decLoop function', function() {
    it('should return the max-1 of the interval for a value at min of the interval', function() {
      expect(_.decLoop(2, 2, 5)).to.equal(4);
    });
    it('should return the max-2 of the interval for a value at max-1 of the interval', function() {
      expect(_.decLoop(4, 2, 5)).to.equal(3);
    });
    it('should return max-2 of the interval for a value at min-1 of the interval', function() {
      expect(_.decLoop(1, 2, 5)).to.equal(3);
    });
    it('should work with negative numbers', function() {
      expect(_.decLoop( 0, -5, -1)).to.equal(-5);
      expect(_.decLoop(-1, -5, -1)).to.equal(-2);
      expect(_.decLoop(-2, -5, -1)).to.equal(-3);
      expect(_.decLoop(-3, -5, -1)).to.equal(-4);
      expect(_.decLoop(-4, -5, -1)).to.equal(-5);
      expect(_.decLoop(-5, -5, -1)).to.equal(-2);
      expect(_.decLoop(-6, -5, -1)).to.equal(-3);
    });
  });

  describe('The resultObject function', function() {
    it('should return a simple (no functions) object unmodified', function() {
      var a = {a: 1, b: 'foo', c: 3.14, d: {e: 2, f: 'bar', g: '1.67'}};
      var b = _.resultObject(a);
      expect(b).to.deep.equal(a);
    });
    it('should return a copy of an object except with its function properties evaluted when given an object with function properties', function() {
      var a = {a: 1, b: function() { return 'foo'; }, c: 3.14, d: {e: 2, f: 'bar', g: '1.67'}};
      var b = _.resultObject(a);
      var nonFunctionProperties = ['a', 'c', 'd'];
      expect(b).not.to.deep.equal(a);
      expect(lodash.pick(b, nonFunctionProperties)).to.be.deep.equal(lodash.pick(a, nonFunctionProperties));
      expect(b.b).to.be.equal(a.b());
    });
    it('should not evalute functions in objects deeply', function() {
      var a = {a: 1, b: 'foo', c: 3.14, d: {e: 2, f: function() { return 'bar'; }, g: '1.67'}};
      var b = _.resultObject(a);
      expect(b).to.deep.equal(a);
    });
    it('should not necessarily return the same object when evaluted on objects with non-deterministic function properties', function() {
      var a = {a: 1, b: function() { return Math.random(); }, c: 3.14, d: {e: 2, f: 'bar', g: '1.67'}};
      var b = _.resultObject(a);
      var c = _.resultObject(a);
      expect(b).not.to.deep.equal(c);
    });
    it('should replace shallow undefined properties with the defaultValue if one is provided', function() {
      var a = {a: 1, b: undefined, c: undefined, d: {e: 2, f: 'bar', g: '1.67'}};
      var b = _.resultObject(a, 'foo');
      var nonUndefinedProperties = ['a', 'd'];
      expect(lodash.pick(b, nonUndefinedProperties)).to.be.deep.equal(lodash.pick(a, nonUndefinedProperties));
      expect(b.b).to.be.equal('foo');
      expect(b.c).to.be.equal('foo');
    });
  });
});

