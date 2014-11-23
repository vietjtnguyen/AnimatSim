var d3 = require('d3');

var _ = require('./util');
var colors = require('./colors');

/**
 */
function Tile(row, col, x, y, size, height) {
  this.row = row;
  this.col = col;
  this.x = x;
  this.y = y;
  this.size = size;
  this.height = height; // height won't change so let's cache the value
  this.color = d3.rgb(255, 255, 255);
}

/**
 */
Tile.prototype.update = function(environment) {
  var self = this;

  var vegetationColor;
  switch( settings.tileDisplayMode )
  {
  case settings.ED_NORMAL:
    if( this.height < environment.waterLevel )
    {
      this.color = waterColor;
    }
    else
    {
      var t = util.clamp((this.height - environment.waterLevel) / 0.025, 0.0, 1.0);
      var terrainColor = d3.rgb(terrainColorScale(this.height));
      vegetationColor = d3.rgb(vegetationColorScale(this.height));
      var vegetationValue = environment.vegetation.values[this.row][this.col];
      this.color = util.lerpColor(waterColor, util.lerpColor(terrainColor, vegetationColor, vegetationValue), t);
    }
    break;

  case settings.ED_TEMPERATURE_ONLY:
    var temperature = environment.temperature.values[this.row][this.col];
    var temperatureColor = d3.rgb(temperatureColorScale(temperature));
    this.color = temperatureColor;
    break;

  case settings.ED_MOISTURE_ONLY:
    var moisture = environment.moisture.values[this.row][this.col];
    var moistureColor = d3.rgb(moistureColorScale(moisture));
    this.color = moistureColor;
    break;

  case settings.ED_VEGETATION_ONLY:
    var vegetation = environment.vegetation.values[this.row][this.col];
    vegetationColor = d3.rgb(vegetationColorScale(this.height));
    this.color = util.lerpColor(d3.rgb(0, 0, 0), vegetationColor, vegetation);
    break;

  case settings.ED_ANIMAT_DENSITY_ONLY:
    var animatDensity = environment.animatDensity.values[this.row][this.col] / (app.populationSize * 0.05);
    var animatDensityColor = d3.rgb(animatDensityColorScale(animatDensity));
    this.color = util.lerpColor(d3.rgb(0, 0, 0), animatDensityColor, Math.sqrt(animatDensity));
    break;

  default:
    break;
  }
};

/**
 */
function EnvironmentVisualization(d3SvgGroup, environment) {
  var self = this;

  // Remember the SVG D3 selection.
  self.d3SvgGroup = d3SvgGroup;

  // Remember associated environment.
  self.environment = environment;

  // Initialize the environment display.
  self.tileDisplayMode = settings.ED_NORMAL; // FIXME: Reference error.

  // Initialize an array to contain the visualization tiles.
  self.tiles = new Array(self.environment.rows * self.environment.cols);
  self.iterateVertices(function(value, arr, i, j) {
    self.tiles[i * self.environment.cols + j] = new Tile(
      i, j,
      j * environment.segmentLength, i * environment.segmentLength,
      environment.segmentLength,
      arr[i][j]);
  });
}

EnvironmentVisualization.render = function() {
  var self = this;

  // Create the D3 selection.
  var tilesSelection = this.d3SvgGroup.selectAll('.tile').data(this.tiles);

  // Add any missing times.
  // TODO: Pre-initialize this and just cache the resulting selection.
  tilesSelection.enter().append('rect')
    .classed('tile', true);

  // Update the SVG visualization. Assumes that Tile.update has been called prior.
  tilesSelection 
    .attr('x', function(d) { return d.x - d.size * 0.5; })
    .attr('y', function(d) { return d.y - d.size * 0.5; })
    .attr('width', function(d) { return d.size; })
    .attr('height', function(d) { return d.size; })
    .style('fill', function(d) { return d.color.toString(); })
  ;
};

EnvironmentVisualization.prototype.iterateTiles = function(func) {
  var self = this;
  for( var i = 0; i < this.tiles.length; i += 1 )
  {
    func(this.tiles, i, this.tiles[i]);
  }
};

EnvironmentVisualization.ED_NORMAL = 0;
EnvironmentVisualization.ED_TEMPERATURE_ONLY = 1;
EnvironmentVisualization.ED_MOISTURE_ONLY = 2;
EnvironmentVisualization.ED_VEGETATION_ONLY = 3;
EnvironmentVisualization.ED_ANIMAT_DENSITY_ONLY = 4;
EnvironmentVisualization.numOfEnvironmentDisplayModes = 5;

module.exports = EnvironmentVisualization;
