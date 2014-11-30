var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

describe('The EnvironmentVisualization module', function() {
  var Environment = require('../src/js/Environment');
  var EnvironmentVisualization = require('../src/js/EnvironmentVisualization');
  it('should contain the EnvironmentVisualization class', function() {
    expect(EnvironmentVisualization.name).to.equal('EnvironmentVisualization');
    var d3SvgGroup = null;
    var environment = new Environment();
    var environmentVisualization = new EnvironmentVisualization(d3SvgGroup, environment);
    expect(environmentVisualization).to.exist();
  });

  describe('The EnvironmentVisualization class', function() {
    it('should fail to construct when not provided an Environment', function() {
      expect(function() {
        var d3SvgGroup = null;
        var environment = null;
        var environmentVisualization = new EnvironmentVisualization(d3SvgGroup, environment);
        expect(environmentVisualization).to.exist();
      }).to.throw(Error);
    });
    it('should contain a tile for each vertex in the environment terrain mesh grid');
    it('should position the tiles into a grid pattern matching the environment terrain mesh grid');
    it('should, when rendered, change the color of a tile to the color resulting from the application of a tile brush');
    it('should use the terrain brush by default');
  });
});
