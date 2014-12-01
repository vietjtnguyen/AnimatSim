/**
 * Extends LoDash with a clamp function and then re-exports it. That's it.
 * @module util
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
 * @memberof module:util
 */
_.clamp = function(x, a, b)
{
	return Math.min(Math.max(x, a), b);
};

/**
 * Increments the value x but loops it inside the interval [a, b).
 * @name incLoop
 * @function
 * @memberof module:util
 */
_.incLoop = function(x, a, b)
{
  return a + (x - a + 1) % (b - a);
};

/**
 * Decrements the value x but loops it inside the interval [a, b).
 * @name decLoop
 * @function
 * @memberof module:util
 */
_.decLoop = function(x, a, b)
{
  return a + (x - a - 1 + (b - a)) % (b - a);
};

/**
 * Operates similar to [LoDash's result function]{@link https://lodash.com/docs#result} except on all object keys. Adopted from [the result function source]{@link https://github.com/lodash/lodash/blob/master/lodash.js#L9820}.
 * @name resultObject
 * @function
 * @arg object {Object}
 * @arg defaultValue [{}] The value to set a key that is undefined. By default this is just undefined.
 * @return {Object}
 * @memberof module:util
 */
_.resultObject = function(object, defaultValue)
{
  return _.mapValues(object, function(value, key, object) {
    if ( typeof value == 'undefined' )
    {
      return defaultValue;
    }
    return _.isFunction(value) ? object[key]() : value;
  });
};

module.exports = _;

