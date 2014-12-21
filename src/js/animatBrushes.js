var d3 = require('d3');

var _ = require('./util');
var colors = require('./colors');

var exports = {};

exports.normal = function(animat)
{
  return colors.animatEnergyColorScale(animat.energy);
};

swimming_only = function(animat)
{
  return colors.animatSwimmingColorScale(animat.swimming);
};

eating_only = function(animat)
{
  return colors.redGreenColorScale(animat.eatAmount / 0.2);
};

stomach_only = function(animat)
{
  return colors.redGreenColorScale(animat.stomach);
};

moving_only = function(animat)
{
  return colors.redGreenColorScale(animat.moveAmount / 1.5);
};

vulnerability_only = function(animat)
{
  return colors.greenRedColorScale(animat.vulnerability / 0.01);
};

distfromhist_only = function(animat)
{
  return colors.redGreenColorScale(animat.distanceFromHistory / 10.0);
};

avoidance_only = function(animat)
{
  return colors.avoidanceColorScale(animat.avoidance);
};

module.exports = exports;

