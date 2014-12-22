var _ = require('./util');

/**
 * @private
 */
function makeAnimatId()
{
  makeAnimatId.globalAnimatCounter += 1;
  return makeAnimatId.globalAnimatCounter;
}
makeAnimatId.globalAnimatCounter = -1;

/**
 * @classdesc
 * @arg {Object} settings
 * @arg [{function}] idFunc
 * @class
 */
function BaseAnimat(settings)
{
  var self = this;

  // Apply default settings and specified settings.
	_.assign(self, BaseAnimat.defaultSettings, _.pick(settings, BaseAnimat.validSettingKeys));
	var ignoredKeys = _.difference(_.keys(settings), BaseAnimat.validSettingsKeys);
	if ( ignoredKeys.length > 0 )
	{
	  console.log(_.keys(settings));
	  console.log(BaseAnimat.validSettingsKeys);
	  console.log('WARN: The following settings for BaseAnimat construction were ignored: ' + ignoredKeys.join(', '));
	}

  // Assign a unique ID to the animat.
  if ( !_.isFunction(self.generateId) )
  {
    throw Error('Animat ID generator must be a function that generates a unique ID.');
  }
  self.id = self.generateId();
}


/**
 * @static
 * @memberof BaseAnimat
 */
BaseAnimat.defaultSettings =
  {
    ticks: 0,
    x: 0.0,
    y: 0.0,
    dir: 0.0,
    customReset: null,
    generateId: makeAnimatId
  };

/**
 * Array of valid setting keys that will be [picked]{@link
 * https://lodash.com/docs#pick} from the settings object passed to {@link
 * BaseAnimat}'s constructor. This array is [pulled]{@link
 * https://lodash.com/docs#keys} from {@link BaseAnimat.defaultSettings}.
 * @static
 */
BaseAnimat.validSettingKeys = _.keys(BaseAnimat.defaultSettings);

/**
 * Apply default reset and then allow custom reset to override changes.
 */
BaseAnimat.prototype.reset = function()
{
  var self = this;
  self.defaultReset();
  if ( _.isFunction(self.customReset) )
  {
    self.customReset();
  }
};

/**
 * The default reset function that is performed to reset animat attributes for
 * a new simulation. These values can be overriden by specifying a customReset
 * function in the settings object on BaseAnimat construction.
 */
BaseAnimat.prototype.defaultReset = function(environment)
{
  var self = this;
  self.ticks = 0;
  self.x = 0.0;
  self.y = 0.0;
  self.dir = 0.0;
};

/**
 * Evalute a simulation step.
 */
BaseAnimat.prototype.step = function(environment)
{
  var self = this;
  self.ticks += 1;
};

module.exports = BaseAnimat;

