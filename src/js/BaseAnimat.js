var _ = require('./util');

/**
 * @private
 */
function makeAnimatId()
{
  makeAnimatId.globalAnimatCounter += 1;
  return globalAnimatCounter;
}
makeAnimatId.globalAnimatCounter = -1;

/**
 * @classdesc
 * @arg {Object} settings
 * @arg [{function}] idFunc
 * @class
 */
function BaseAnimat(settings, idFunc)
{
  var self = this;

  // Apply default settings and specified settings.
	_.assign(self, BaseAnimat.defaultSettings, _.pick(settings, BaseAnimat.validSettingKeys));

  self.reset();

  // Create/assign brain.
  self.brain = _.isFunction(brain) ? brain() : brain;

  // Assign a unique ID to the animat.
  self.id = _.isFunction(idFunc) ? idFunc() : makeAnimatId();
}


/**
 * @static
 * @memberof BaseAnimat
 */
BaseAnimat.defaultSettings =
  {
    customReset: null
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
 * Apply default reset and then allow custom reset to override changes. After
 * that, run pre-simulation initialization. This is not meant to be called
 * explicitly.
 */
BaseAnimat.prototype.reset = function()
{
  var self = this;
  self.defaultReset();
  if ( _.isFunction(self.customReset) )
  {
    self.customReset();
  }
  self.init();
};

/**
 * The default reset function that is performed to reset animat attributes for
 * a new simulation. These values can be overriden by specifying a customReset
 * function in the settings object on BaseAnimat construction.
 */
BaseAnimat.prototype.defaultReset = function(environment)
{
  var self = this;
  self.x = 0.0;
  self.y = 0.0;
  self.dir = 0.0;
};

/**
 * Perform pre-simulation initialization. Right now this simply consists of
 * initializing the position history.
 */
BaseAnimat.prototype.init = function()
{
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


