/**
 * @module
 */

var exports = {};

/**
 * @name cartesianToPolar
 * @function
 */
exports.cartesianToPolar = function(xy) {
  return [
    Math.atan2(xy[1], xy[0]),
    Math.sqrt(xy[0] * xy[0] + xy[1] * xy[1])
  ];
};

/**
 * @name polarToCartesian
 * @function
 */
exports.polarToCartesian = function(rd) {
  return [
    Math.cos(rd[1]) * rd[0],
    Math.sin(rd[1]) * rd[0]
  ];
};

/**
 * @name rotateVec
 * @function
 */
exports.rotateVec = function(xy, ang)
{
  return [
    xy[0] * Math.cos(ang) + xy[1] * -Math.sin(ang),
    xy[0] * Math.sin(ang) + xy[1] * Math.cos(ang)
  ];
};

module.exports = exports;
