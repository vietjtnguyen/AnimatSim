var _ = require('./util');

/**
 * @classdesc
 * Behaviors encapsulate animat behaviors and can be attached to animats to
 * modify their state by sensing the environment and executing actions.
 * @arg {Object} settings - Specifies settings to override in animat (see {@link Behavior.defaultSettings}).
 * @class
 */
function Behavior(settings) {
  var self = this;

  // Apply default settings and specified settings.
	_.assign(self, Behavior.defaultSettings, _.pick(settings, Behavior.validSettingKeys));
}

Behavior.defaultSettings =
  {
    x: 0.0,
    y: 0.0,
    dir: 0.0,
    ticks: 0
  };

/**
 * Array of valid setting keys that will be [picked]{@link https://lodash.com/docs#pick} from the settings object passed to {@link Behavior}'s constructor. This array is [pulled]{@link https://lodash.com/docs#keys} from {@link Behavior.defaultSettings}.
 * @static
 */
Behavior.validSettingKeys = _.keys(Behavior.defaultSettings);

