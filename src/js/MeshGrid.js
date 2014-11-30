var fractalTerrainGenerator = require('fractal-terrain-generator');

var _ = require('./util');

var sqrtOfTwo = 1.4142135623730951;

// -------------------------------------------------------------------------
// MeshGrid
// The terrain is represented by a two-dimensional array of vertex heights.
// The class also includes convenience functions to calculate value given
// a page coordinate and to calculate a gradient at a page coordinate.

// ---- constructor

var MeshGrid = function(numOfSegments, segmentLength, smoothness, postProcessFunc)
{
  this.numOfSegments = numOfSegments;
  this.numOfVertices = this.numOfSegments + 1;
  this.sizeInSegments = this.numOfSegments * this.numOfSegments;
  this.sizeInVertices = this.numOfVertices * this.numOfVertices;

  this.segmentLength = segmentLength;

  if( smoothness === undefined )
  {
    smoothness = 1.0;
  }

  // The `heights` array is index as [row][column] where row results in
  // increasing y-coordinate value (down the page) and column results in
  // increasing x-coordinate value (to the right across the page).
  // Usually I have it as [x][y] but my recently experience with matrix
  // calculations and NumPy have me thinking in [row][column].
  this.values = fractalTerrainGenerator.generateTerrain(this.numOfSegments, this.numOfSegments, smoothness);
  this.normalizeValues();

  if( postProcessFunc !== undefined )
  {
    this.iterateVertices(postProcessFunc);
  }
};

// ---- methods

// Convenience function to iterate across all vertices.
MeshGrid.prototype.iterateVertices = function(func)
{
  for( var i = 0; i < this.numOfVertices; i += 1 )
  {
    for( var j = 0; j < this.numOfVertices; j += 1 )
    {
      func(this.values[i][j], this.values, i, j);
    }
  }
};

MeshGrid.prototype.iterateNeighbors = function(func)
{
  for( var i = 0; i < this.numOfVertices - 1; i += 1 )
  {
    for( var j = 0; j < this.numOfVertices - 1; j += 1 )
    {
      func(this.values[i  ][j  ], this.values[i+1][j  ], this.values, i  , j  , i+1, j  , 1.0);
      func(this.values[i  ][j  ], this.values[i+1][j+1], this.values, i  , j  , i+1, j+1, sqrtOfTwo);
      func(this.values[i  ][j  ], this.values[i  ][j+1], this.values, i  , j  , i  , j+1, 1.0);
      func(this.values[i+1][j  ], this.values[i  ][j+1], this.values, i+1, j  , i  , j+1, sqrtOfTwo);

      func(this.values[i+1][j  ], this.values[i  ][j  ], this.values, i+1, j  , i  , j  , 1.0);
      func(this.values[i+1][j+1], this.values[i  ][j  ], this.values, i+1, j+1, i  , j  , sqrtOfTwo);
      func(this.values[i  ][j+1], this.values[i  ][j  ], this.values, i  , j+1, i  , j  , 1.0);
      func(this.values[i  ][j+1], this.values[i+1][j  ], this.values, i  , j+1, i+1, j  , sqrtOfTwo);
    }
  }
};

MeshGrid.prototype.distributeSeeds = function(numOfSeeds, seedValueFunc) {
  var i, j;
  var seedIndex;
	for( seedIndex = 0; seedIndex < numOfSeeds; seedIndex += 1 ) {
		i = _.random(0, this.numOfVertices - 1);
    j = _.random(0, this.numOfVertices - 1);
		this.values[i][j] = seedValueFunc(i, j);
	}
};

// Ensure that the heights are normalized (with values between 0 and 1)
// since I can't find any material on what the bounds are on heights generated
// by the terrain generator.
MeshGrid.prototype.normalizeValues = function()
{
  // Figure out what the range of heights is.
  var minValue = Number.POSITIVE_INFINITY, maxValue = Number.NEGATIVE_INFINITY;
  this.iterateVertices(function(value)
  {
    minValue = Math.min(minValue, value);
    maxValue = Math.max(maxValue, value);
  });

  // Transform the heights to a domain of [0, 1]
  this.iterateVertices(function(value, arr, i, j)
  {
    arr[i][j] = (arr[i][j] - minValue) / (maxValue - minValue);
  });
};

// The x and y coordinates here represent tile coordinates where positive x
// goes to the right and positive y goes down but the domain is
// [0, numOfVertices].
MeshGrid.prototype.getValue = function(x, y)
{
  // I'll just do bilinear interpolation for now, but I'd like to get
  // bicubic interpolation working.
  // TODO: http://www.strauss-acoustics.ch/js-bilinear-interpolation.html

  // Clamp coordinates to prevent indexing errors.
  x = Math.max(Math.min(x, this.numOfVertices - 1), 0);
  y = Math.max(Math.min(y, this.numOfVertices - 1), 0);

  // Calculate values for bilinear interpolation.
  var l = Math.floor(x), // left
    r = Math.ceil(x),  // right
    t = Math.floor(y), // top
    b = Math.ceil(y);  // bottom
  var tlh = this.values[t][l], // top-left
    trh = this.values[t][r], // top-right
    blh = this.values[b][l], // bottom-left
    brh = this.values[b][r]; // bottom-right
  var tx = x - l, // x parameter [0, 1]
    ty = y - t; // y parameter [0, 1]
  
  // Return bilinearly interpolated value.
  return tlh * (1 - tx) * (1 - ty) + trh * tx * (1 - ty) + blh * (1 - tx) * ty + brh * tx * ty;
};

MeshGrid.prototype.addValue = function(x, y, a)
{
  // I'll just do bilinear interpolation for now, but I'd like to get
  // bicubic interpolation working.
  // TODO: http://www.strauss-acoustics.ch/js-bilinear-interpolation.html

  // Clamp coordinates to prevent indexing errors.
  x = Math.max(Math.min(x, this.numOfVertices - 1), 0);
  y = Math.max(Math.min(y, this.numOfVertices - 1), 0);

  // Calculate values for bilinear interpolation.
  var l = Math.floor(x), // left
    r = Math.ceil(x),  // right
    t = Math.floor(y), // top
    b = Math.ceil(y);  // bottom
  var tx = x - l, // x parameter [0, 1]
    ty = y - t; // y parameter [0, 1]
  
  this.values[t][l] += a * (1 - tx) * (1 - ty);
  this.values[t][r] += a * tx * (1 - ty);
  this.values[b][l] += a * (1 - tx) * ty;
  this.values[b][r] += a * tx * ty;
};

MeshGrid.prototype.getGradient = function(x, y, step)
{
  var lh = this.getValue(x - step, y),
    rh = this.getValue(x + step, y),
    th = this.getValue(x, y - step),
    bh = this.getValue(x, y + step);
  step = step * 2.0;
  return [(rh - lh) / step, (bh - th) / step];
};

MeshGrid.prototype.serialize = function()
{
  var self = this;
  return JSON.stringify(self.values, null, '\t');
};

MeshGrid.prototype.unserialize = function(serializedMeshGrid)
{
  var self = this;
  app.environment.terrain.values = serializedMeshGrid;
};

// ---- statics

module.exports = MeshGrid;

