var d3 = require('d3');

var _ = require('./util');
var colors = require('./colors');

// -------------------------------------------------------------------------
// Tile
// Tiles are used to represent the terrain, vegetation, water, etc. Their
// actual on screen representation is simply a rectangle that is colored
// according to what is there.

// ---- constructor

var Tile = function(row, col, x, y, size, height)
{
  this.row = row;
  this.col = col;
  this.x = x;
  this.y = y;
  this.size = size;
  this.height = height; // height won't change so let's cache the value
  this.color = d3.rgb(255, 255, 255);
};

// ---- methods

Tile.prototype.update = function(environment)
{
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

// ---- statics

// Initialize tiles which are used to display terrain height, water
// height, vegetation, etc.
Tile.init = function(terrain)
{
  var tiles = new Array(terrain.numOfVertices * terrain.numOfVertices);

  terrain.iterateVertices(function(value, arr, i, j)
  {
    tiles[i * terrain.numOfVertices + j] = new Tile(
      i, j,
      j * terrain.segmentLength, i * terrain.segmentLength,
      terrain.segmentLength,
      arr[i][j]);
  });

  return tiles;
};

module.exports = Tile;














// TODO: Merge Tile with this. Tile can just be a vanilla object, it doesn't
// have to be a class. Whatever behavior is in there can be given to the
// visualization.

function EnvironmentVisualization(d3SvgGroup, terrain, population) {
  // Remember the SVG D3 selection.
  this.d3SvgGroup = d3SvgGroup;
  // Initialize the environment display.
  this.tileDisplayMode = settings.ED_NORMAL; // FIXME: Reference error.
  // Initialize an array to contain the visualization tiles.
  this.tiles = new Array(terrain.numOfVertices * terrain.numOfVertices);
  this.tiles = Tile.init(this.terrain);
  // Fill the array with tiles.
  terrain.iterateVertices(function(value, arr, i, j)
  {
    tiles[i * terrain.numOfVertices + j] = new Tile(
      i, j,
      j * terrain.segmentLength, i * terrain.segmentLength,
      terrain.segmentLength,
      arr[i][j]);
  });
}

EnvironmentVisualization.render = function() {
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

Environment.prototype.iterateTiles = function(func)
{
  for( var i = 0; i < this.tiles.length; i += 1 )
  {
    func(this.tiles, i, this.tiles[i]);
  }
};

Environment.prototype.updateTiles = function()
{
  var env = this;
  this.iterateTiles(function(tiles, i, tile) { tile.update(env); });
};

Environment.prototype.render = function(tilesRoot)
{
  Tile.updateRepresentations(tilesRoot, this.tiles);
};

EnvironmentVisualization.ED_NORMAL = 0;
EnvironmentVisualization.ED_TEMPERATURE_ONLY = 1;
EnvironmentVisualization.ED_MOISTURE_ONLY = 2;
EnvironmentVisualization.ED_VEGETATION_ONLY = 3;
EnvironmentVisualization.ED_ANIMAT_DENSITY_ONLY = 4;
EnvironmentVisualization.numOfEnvironmentDisplayModes = 5;

module.exports = EnvironmentVisualization;


