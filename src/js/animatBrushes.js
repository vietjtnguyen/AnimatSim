var d3 = require('d3');

var _ = require('./util');
var colors = require('./colors');

var exports = {};

switch( settings.animatDisplayMode )
{
case settings.AD_NORMAL:
  representations.style('fill', function(d) { return animatEnergyColorScale(d.energy); });
  break;
case settings.AD_SWIMMING_ONLY:
  representations.style('fill', function(d) { return d.swimming ? '#0000ff' : '#ffff00'; });
  break;
case settings.AD_EATING_ONLY:
  representations.style('fill', function(d) { return redGreenColorScale(d.eatAmount / 0.2); });
  break;
case settings.AD_STOMACH_ONLY:
  representations.style('fill', function(d) { return redGreenColorScale(d.stomach); });
  break;
case settings.AD_MOVING_ONLY:
  representations.style('fill', function(d) { return redGreenColorScale(d.moveAmount / 1.5); });
  break;
case settings.AD_VULNERABILITY_ONLY:
  representations.style('fill', function(d) { return greenRedColorScale(d.vulnerability / 0.01); });
  break;
case settings.AD_DISTFROMHIST_ONLY:
  representations.style('fill', function(d) { return redGreenColorScale(d.distanceFromHistory / 10.0); });
  break;
case settings.AD_AVOIDANCE_ONLY:
  representations.style('fill', function(d) { return avoidanceColorScale(d.avoidance); });
  break;
}

module.exports = exports;

