function PopulationVisualization() {
}

Population.prototype.render = function(root, brush)
{
  brush = brush ? brush : animatBrushes.energy;

  var representations = root.selectAll('.animat').data(this.aliveAnimats);

  representations.enter().append('path')
    .classed('animat', true)
    .attr('d', 'M 4 0 L -4 3 L -4 -3 L 4 0');
  representations.exit().remove();

  representations
    .attr('transform', function(d)
    {
      return 'matrix('+Math.cos(d.dir)+' '+Math.sin(d.dir)+' '+(-Math.sin(d.dir))+' '+Math.cos(d.dir)+' '+d.x+' '+d.y+')';
    })
    .style('fill', brush);
};

module.exports = PopulationVisualization;

