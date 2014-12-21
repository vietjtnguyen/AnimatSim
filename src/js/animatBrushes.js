var d3 = require('d3');

var _ = require('./util');
var colors = require('./colors');

var exports = {};

exports.energy = function(animat)
{
  return colors.animatEnergyColorScale(animat.energy);
};

exports.swimming = function(animat)
{
  return colors.animatSwimmingColorScale(animat.swimming);
};

exports.eating = function(animat)
{
  return colors.redGreenColorScale(animat.eatAmount / 0.2);
};

exports.stomach = function(animat)
{
  return colors.redGreenColorScale(animat.stomach);
};

exports.moving = function(animat)
{
  return colors.redGreenColorScale(animat.moveAmount / 1.5);
};

exports.vulnerability = function(animat)
{
  return colors.greenRedColorScale(animat.vulnerability / 0.01);
};

exports.distfromhist = function(animat)
{
  return colors.redGreenColorScale(animat.distanceFromHistory / 10.0);
};

exports.avoidance = function(animat)
{
  return colors.avoidanceColorScale(animat.avoidance);
};

module.exports = exports;

