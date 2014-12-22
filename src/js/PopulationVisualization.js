var geom = require('./geom');

function PopulationVisualization(d3SvgGroup, population)
{
  var self = this;

  // Remember the SVG D3 selection.
  self.d3SvgGroup = d3SvgGroup;

  // Remember associated population.
  if ( !population )
  {
    throw Error('PopulationVisualization requires an population on construction.');
  }
  self.population = population;
}

Population.prototype.render = function(brush)
{
  var self = this;

  brush = brush ? brush : animatBrushes.energy;

  var representations = self.d3SvgGroup.selectAll('path')
    .data(self.population.aliveAnimats);

  representations.enter().append('path')
    .attr('d', 'M 4 0 L -4 3 L -4 -3 L 4 0');
  representations.exit().remove();

  representations
    .attr('transform', function(animat)
    {
      return geom.css2DEuclideanTransformMatrix (animat.x, animat.y, animat.dir);
    })
    .style('fill', brush);
};

module.exports = PopulationVisualization;

