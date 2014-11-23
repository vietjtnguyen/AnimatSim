/**
 * Extends LoDash with a clamp function and then re-exports it. That's it.
 * @module
 * @example
 * var _ = require('./util');
 * var x = _.clamp(_.random(-100.0, 100.0), -1.0, 1.0);
 * x >= -1.0 // true
 * x <= 1.0 // true
 * _.isEqual(_.keys({a: 1, b: 2}), ['a', 'b']) // true, regular lodash still there
 */
var _ = require('lodash');

/**
 * Clamps a value to within an interval.
 * @name clamp
 * @function
 * @arg x {} Value to be clamped.
 * @arg a {} Lower bound.
 * @arg b {} Upper bound.
 * @return {} <pre><code>Math.min(Math.max(x, a), b);</code></pre>
 */
_.clamp = function(x, a, b) {
	return Math.min(Math.max(x, a), b);
};

/**
 */
_.resultObject = function(object, defaultValue) {
  return _.mapValues(object, function(value, key, object) {
    if (typeof value == 'undefined') {
      return defaultValue;
    }
    return isFunction(value) ? object[key]() : value;
  });
};

module.exports = _;

