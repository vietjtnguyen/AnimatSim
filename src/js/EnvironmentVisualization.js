var d3 = require('d3');

var _ = require('./util');
var tileBrushes = require('./tileBrushes');

/**
 * A simple container class to represent the visual information of an
 * environment tile.
 * @class
 */
function Tile(row, col, x, y, size, height)
{
  var self = this;
  self.row = row;
  self.col = col;
  self.x = x;
  self.y = y;
  self.size = size;
  self.height = height; // height won't change so let's cache the value
  self.color = d3.rgb(255, 255, 255);
}

/**
 * @class
 */
function EnvironmentVisualization(d3SvgGroup, environment, population)
{
  var self = this;

  // Remember the SVG D3 selection.
  self.d3SvgGroup = d3SvgGroup;

  // Remember associated environment.
  if ( !environment )
  {
    throw Error('EnvironmentVisualization requires an environment on construction.');
  }
  self.environment = environment;

  // Remember associated population.
  self.population = population;

  // Initialize an array to contain the visualization tiles.
  self.tiles = new Array(self.environment.rows * self.environment.cols);
  self.environment.terrain.iterateVertices(function(value, arr, i, j)
  {
    self.tiles[i * (self.environment.cols + 1) + j] = new Tile(
      i, j,
      j * environment.tileSize, i * environment.tileSize,
      environment.tileSize,
      arr[i][j]);
  });
}

/**
 */
EnvironmentVisualization.prototype.render = function(brush) {
  var self = this;

  // If the brush is a function, call it with the associated environment.
  // Otherwise use the brush. If no brush is defined, used the terrain brush by
  // default.
  brush = brush ? brush : tileBrushes.terrain;

  // "Brush" each tile with the provided brush. This takes information from the
  // associated environment and population in order to "color" the tile
  // appropriately.
  _.forEach(self.tiles, function(tile) {
    brush(tile, self.environment, self.population);
  });

  // Create the D3 selection.
  var tilesD3Selection = self.d3SvgGroup.selectAll('rect')
    .data(self.tiles);

  // Add any missing tiles.
  // TODO: Pre-initialize this and just cache the resulting selection.
  tilesD3Selection.enter().append('rect')
    .classed('tile', true);

  // Update the tile visualizations.
  tilesD3Selection 
    .attr('x', function(d) { return d.x - d.size * 0.5; })
    .attr('y', function(d) { return d.y - d.size * 0.5; })
    .attr('width', function(d) { return d.size; })
    .attr('height', function(d) { return d.size; })
    .style('fill', function(d) { return d.color.toString(); })
  ;
};

module.exports = EnvironmentVisualization;

