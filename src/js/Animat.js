var _ = require('./util');

/**
 * @private
 */
function makeAnimatId() {
  makeAnimatId.globalAnimatCounter += 1;
  return globalAnimatCounter;
}
makeAnimatId.globalAnimatCounter = -1;

/**
 * @classdesc
 * Animats are essentially state containers that can accept "middleware" that
 * actually senses its environment and executes behavior.
 * @arg {Object} environment
 * @arg {Object} settings Specifies settings to override in animat (see {@link Animat.defaultSettings}).
 * @arg [{function}] idFunc
 * @class
 */
function Animat(environment, settings, idFunc) {
  var self = this;

  /**
   */
  self.settings = settings;

  self.reset();

  // Assign an ID.
  self.id = _.isFunction(idFunc) ? idFunc() : makeAnimatId();
}


/**
 */
Animat.defaultSettings =
  {
    x: 0.0,
    y: 0.0,
    dir: 0.0,
    ticks: 0
  };

/**
 * Array of valid setting keys that will be [picked]{@link
 * https://lodash.com/docs#pick} from the settings object passed to {@link
 * Animat}'s constructor. This array is [pulled]{@link
 * https://lodash.com/docs#keys} from {@link Animat.defaultSettings}.
 * @static
 */
Animat.validSettingKeys = _.keys(Animat.defaultSettings);

/**
 */
Animat.prototype.reset = function() {
  var self = this;

  // Apply default settings and specified settings.
	_.assign(self, Animat.defaultSettings, _.objectResult(_.pick(settings, Animat.validSettingKeys)));
};



Animat.prototype.reset = function()
{
  var self = this;
  self.ticks = 0;

  //self.dir = _.random(0.0, Math.PI * 2.0);
  //self.x = _.random(0.0, app.environment.size);
  //self.y = _.random(0.0, app.environment.size);
  self.dir = _.random(-0.1, 0.1);
  self.x = app.environment.size * (0.5 + _.random(-0.02, 0.02));
  self.y = app.environment.size * (0.5 + _.random(-0.02, 0.02));

  self.xHistory = self.x;
  self.yHistory = self.y;

  self.energy = 100.0;
  self.stomach = 1.0;
  self.vulnerability = 0.0;
};

Animat.prototype.step = function()
{
  var self = this;
  self.ticks += 1;
};

module.exports = Animat;

