var d3 = require('d3');

var _ = require('./util');
var colors = require('./colors');

function TileTerrainBrush(tile, environment)
{
  if( tile.height < environment.waterLevel )
  {
    tile.color = colors.waterColor;
  }
  else
  {
    var t = util.clamp((tile.height - environment.waterLevel) / 0.025, 0.0, 1.0);
    var terrainColor = d3.rgb(colors.terrainColorScale(tile.height));
    var vegetationColor = d3.rgb(colors.vegetationColorScale(tile.height));
    var vegetationValue = environment.vegetation.values[tile.row][tile.col];
    tile.color = util.lerpColor(colors.waterColor, util.lerpColor(terrainColor, vegetationColor, vegetationValue), t);
  }
}

function TileTemperatureBrush(tile, environment)
{
  var temperature = environment.temperature.values[tile.row][tile.col];
  var temperatureColor = d3.rgb(colors.temperatureColorScale(temperature));
  tile.color = temperatureColor;
}

function TileMoistureBrush(tile, environment)
{
  var moisture = environment.moisture.values[tile.row][tile.col];
  var moistureColor = d3.rgb(colors.moistureColorScale(moisture));
  tile.color = moistureColor;
}

function TileVegetationBrush(tile, environment)
{
  var vegetation = environment.vegetation.values[tile.row][tile.col];
  var vegetationColor = d3.rgb(colors.vegetationColorScale(tile.height));
  tile.color = util.lerpColor(d3.rgb(0, 0, 0), vegetationColor, vegetation);
}

function TileAnimatDensityBrush(tile, environment)
{
  var animatDensity = environment.animatDensity.values[tile.row][tile.col] / (app.populationSize * 0.05);
  var animatDensityColor = d3.rgb(colors.animatDensityColorScale(animatDensity));
  tile.color = util.lerpColor(d3.rgb(0, 0, 0), animatDensityColor, Math.sqrt(animatDensity));
}

/**
 * @class
 */
function Tile(row, col, x, y, size, height)
{
  this.row = row;
  this.col = col;
  this.x = x;
  this.y = y;
  this.size = size;
  this.height = height; // height won't change so let's cache the value
  this.color = d3.rgb(255, 255, 255);
}

/**
 * @class
 */
function EnvironmentVisualization(d3SvgGroup, environment)
{
  var self = this;

  // Remember the SVG D3 selection.
  self.d3SvgGroup = d3SvgGroup;

  // Remember associated environment.
  self.environment = environment;

  // Initialize the environment display.
  self.tileDisplayMode = settings.ED_NORMAL; // FIXME: Reference error.

  // Initialize an array to contain the visualization tiles.
  self.tiles = new Array(self.environment.rows * self.environment.cols);
  self.iterateVertices(function(value, arr, i, j)
  {
    self.tiles[i * self.environment.cols + j] = new Tile(
      i, j,
      j * environment.segmentLength, i * environment.segmentLength,
      environment.segmentLength,
      arr[i][j]);
  });
}

EnvironmentVisualization.ED_NORMAL = 0;
EnvironmentVisualization.ED_TEMPERATURE_ONLY = 1;
EnvironmentVisualization.ED_MOISTURE_ONLY = 2;
EnvironmentVisualization.ED_VEGETATION_ONLY = 3;
EnvironmentVisualization.ED_ANIMAT_DENSITY_ONLY = 4;
EnvironmentVisualization.numOfEnvironmentDisplayModes = 5;

EnvironmentVisualization.render = function()
{
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

EnvironmentVisualization.prototype.iterateTiles = function(func)
{
  var self = this;
  for ( var i = 0; i < this.tiles.length; i += 1 )
  {
    func(this.tiles, i, this.tiles[i]);
  }
};

module.exports = EnvironmentVisualization;
