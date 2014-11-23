var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

describe('The BaseEnvironment module', function() {
  var BaseEnvironment = require('../src/js/BaseEnvironment');
  it('should contain the BaseEnvironment class', function() {
    expect(BaseEnvironment.name).to.equal('BaseEnvironment');
    var baseEnvironment = new BaseEnvironment();
    expect(baseEnvironment).to.exist();
  });
  describe('The BaseEnvironment class', function() {
    it('should construct with sensible defaults', function() {
      var baseEnvironment = new BaseEnvironment();
      expect(baseEnvironment.rows).to.equal(32);
      expect(baseEnvironment.cols).to.equal(32);
      expect(baseEnvironment.tileSize).to.equal(20.0);
      expect(baseEnvironment.width).to.equal(640.0);
      expect(baseEnvironment.height).to.equal(640.0);
    });
    it('should accept settings to override defaults', function() {
      var settings = {
        rows: 99,
        cols: 99,
        tileSize: 3
      };
      var baseEnvironment = new BaseEnvironment(settings);
      expect(baseEnvironment.rows).to.equal(settings.rows);
      expect(baseEnvironment.cols).to.equal(settings.cols);
      expect(baseEnvironment.tileSize).to.equal(settings.tileSize);
    });
    it('should accept calculate width and height correctly', function() {
      var settings = {
        rows: 11,
        cols: 11,
        tileSize: 33.0
      };
      var baseEnvironment = new BaseEnvironment(settings);
      expect(baseEnvironment.width).to.equal(settings.rows * settings.tileSize);
      expect(baseEnvironment.height).to.equal(settings.cols * settings.tileSize);
    });
  });
});
