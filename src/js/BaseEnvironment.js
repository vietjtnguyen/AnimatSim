var _ = require('./util');

var MeshGrid = require('./MeshGrid.js');

/**
 * @classdesc
 * Abstract base class for two dimensional grid environments. The
 * BaseEnvironment is not meant to be instantiated, especially since it has no
 * actual data layers. Instead it simply maintains meta information such as
 * cell count and size.
 * @arg {Object} settings - Specifies settings to override in environment (see
 * {@link BaseEnvironment.defaultSettings}).
 * @class
 * @abstract
 */
function BaseEnvironment(settings)
{
  var self = this;

  // Apply default settings and specified settings.
	_.assign(self, BaseEnvironment.defaultSettings, _.pick(settings, BaseEnvironment.validSettingKeys));

  // TODO: Add support for non-square environments.
	if (self.rows != self.cols)
	{
	  self.cols = self.rows = Math.max(self.rows, self.cols);
	  console.log('Non-square environments not supported yet. Setting rows and cols to ' + self.rows.toString() + '.');
	}
	
	// TODO: This is probably not necessary since there are just Numbers in Javascript.
  // Make sure tileSize is a float. This is needed to make sure the conversion
  // from spatial coordinates to grid coordinates is done as a float so that
  // the fractional remainder can be used for interpolation. (see: `getValue`,
  // `addValue`, `getGradient`).
	self.tileSize = parseFloat(self.tileSize);

	// Calculate the full environment size.
	self.width = self.rows * self.tileSize;
	self.height = self.cols * self.tileSize;
}

/**
 * Static member object which contains default settings for {@link
 * BaseEnvironment} construction.
 * @static
 */
BaseEnvironment.defaultSettings =
  {
    /**
      * Number of rows in the environment grid.
      * @name BaseEnvironment#rows
      * @default 32
      * @member {integer}
      */
    rows: 32,
    /**
      * Number of columns in the environment grid.
      * @name BaseEnvironment#cols
      * @default 32
      * @member {integer}
      */
    cols: 32,
    /**
      * The size of a single grid cell. This determines the total {@link
      * BaseEnvironment#width} and {@link BaseEnvironment#height} of the
      * environment. This value is forced to be a floating point number to make
      * sure the conversion from spatial coordinates to grid coordinates is
      * done as a float so that the fractional remainder can be used for
      * interpolation. (see: {@link BaseEnvironment#getValue}, {@link
      * BaseEnvironment#addValue}, {@link BaseEnvironment#getGradient}).
      * @name BaseEnvironment#tileSize
      * @default 20.0
      * @member {float}
      */
    tileSize: 20.0,
  };

/**
 * Array of valid setting keys that will be [picked]{@link
 * https://lodash.com/docs#pick} from the settings object passed to {@link
 * BaseEnvironment}'s constructor. This array is [pulled]{@link
 * https://lodash.com/docs#keys} from {@link BaseEnvironment.defaultSettings}.
 * @static
 */
BaseEnvironment.validSettingKeys = _.keys(BaseEnvironment.defaultSettings);

/**
 * Gets the interpolated value of the specified mesh grid at spatial location
 * (x, y).
 * @arg {float} x X spatial position (positive goes right) 
 * @arg {float} y Y spatial position (positive goes down) 
 * @arg {string} meshGridName Property name of the mesh grid layer to read from.
 * @return {float} Intepolated value of mesh grid layer meshGridName at spatial coordinates (x, y).
 */
BaseEnvironment.prototype.getValue = function(x, y, meshGridName)
{
  // Convert page coordinates to tile coordinates.
  x = x / this.tileSize;
  y = y / this.tileSize;

  return this[meshGridName].getValue(x, y);
};

/**
 * Adds the specified value to the specified mesh grid at the specified spatial location
 * (x, y). The value is interpolated and distributed to overlapping grid cells.
 * @arg {float} x X spatial position (positive goes right) 
 * @arg {float} y Y spatial position (positive goes down) 
 * @arg {float} a Value to add.
 * @arg {string} meshGridName Property name of the mesh grid layer to add to.
 */
BaseEnvironment.prototype.addValue = function(x, y, a, meshGridName)
{
  // Convert page coordinates to tile coordinates.
  x = x / this.tileSize;
  y = y / this.tileSize;

  this[meshGridName].addValue(x, y, a);
};

/**
 * Gets the interpolated two dimensional gradient at spatial location (x, y)
 * using central difference method.
 * @arg {float} x X spatial position (positive goes right) 
 * @arg {float} y Y spatial position (positive goes down) 
 * @arg {string} meshGridName Property name of the mesh grid layer to read from.
 * @return {float[]}
 */
BaseEnvironment.prototype.getGradient = function(x, y, meshGridName, delta)
{
  // Convert page coordinates to tile coordinates.
  x = x / this.tileSize;
  y = y / this.tileSize;

  // Use a delta slightly larger than 1 for a bit of robustness.
  delta = delta ? delta : 1.1;
  
  var ret = this[meshGridName].getGradient(x, y, delta);
  return [ret[0] / this.tileSize, ret[1] / this.tileSize];
};

module.exports = BaseEnvironment;

