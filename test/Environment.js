var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

describe('The Environment module', function() {
  var Environment = require('../src/js/Environment');
  it('should contain the Environment class', function() {
    expect(Environment.name).to.equal('Environment');
    var environment = new Environment();
    expect(environment).to.exist();
  });

  describe('The Environment class', function() {
    // TODO: The following three tests are from BaseEnvironment. Should they
    // even be included here? How can you test correct prototype chaining?
    it('should construct with sensible defaults', function() {
      var environment = new Environment();
      expect(environment.rows).to.equal(32);
      expect(environment.cols).to.equal(32);
      expect(environment.tileSize).to.equal(20.0);
      expect(environment.width).to.equal(640.0);
      expect(environment.height).to.equal(640.0);
    });
    it('should accept settings to override defaults', function() {
      var settings = {
        rows: 20,
        cols: 20,
        tileSize: 2.5
      };
      var environment = new Environment(settings);
      expect(environment.rows).to.equal(settings.rows);
      expect(environment.cols).to.equal(settings.cols);
      expect(environment.tileSize).to.equal(settings.tileSize);
    });
    it('should accept calculate width and height correctly', function() {
      var settings = {
        rows: 11,
        cols: 11,
        tileSize: 33.0
      };
      var environment = new Environment(settings);
      expect(environment.width).to.equal(settings.rows * settings.tileSize);
      expect(environment.height).to.equal(settings.cols * settings.tileSize);
    });
    it('should contain five layers: terrain, temperature, moisture, vegetation, animatDensity', function() {
      var environment = new Environment();
      expect(environment.terrain).to.exist();
      expect(environment.temperature).to.exist();
      expect(environment.moisture).to.exist();
      expect(environment.vegetation).to.exist();
      expect(environment.animatDensity).to.exist();
    });
    it('should, with default settings, gain more vegetation during isolated simulation', function() {
      var environment = new Environment();
      environment.terrain.iterateVertices(function(value, arr, x, y) {
        arr[x][y] = y;
      });
      environment.terrain.normalizeValues();
      var preVegetationSum = 0.0;
      environment.vegetation.iterateVertices(function(value, arr, x, y) {
        preVegetationSum += value;
      });
      for ( var i = 0; i < 25; i += 1 )
      {
        environment.step();
      }
      var postVegetationSum = 0.0;
      environment.vegetation.iterateVertices(function(value, arr, x, y) {
        postVegetationSum += value;
      });
      expect(postVegetationSum).to.be.greaterThan(preVegetationSum);
    });
  });
});
