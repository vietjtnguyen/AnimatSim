function PopulationVisualization() {
  this.animatDisplayMode = PopulationVisualization.AD_NORMAL;
}

Population.prototype.render = function(root)
{
  var representations = root.selectAll('.animat').data(this.aliveAnimats);

  representations.enter().append('path')
    .classed('animat', true)
    .attr('d', 'M 4 0 L -4 3 L -4 -3 L 4 0');
  representations.exit().remove();

  representations
    .attr('transform', function(d) { return 'matrix('+Math.cos(d.dir)+' '+Math.sin(d.dir)+' '+(-Math.sin(d.dir))+' '+Math.cos(d.dir)+' '+d.x+' '+d.y+')'; });

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
};

PopulationVisualization.AD_NORMAL = 0;
PopulationVisualization.AD_SWIMMING_ONLY = 1;
PopulationVisualization.AD_EATING_ONLY = 2;
PopulationVisualization.AD_STOMACH_ONLY = 3;
PopulationVisualization.AD_MOVING_ONLY = 4;
PopulationVisualization.AD_VULNERABILITY_ONLY = 5;
PopulationVisualization.AD_DISTFROMHIST_ONLY = 6;
PopulationVisualization.AD_AVOIDANCE_ONLY = 7;
PopulationVisualization.numOfAnimatDisplayModes = 8;

module.exports = PopulationVisualization;

