var d3 = require('d3');

function Visualization(domParentElement, population, environment) {
  if (!domParentElement) {
    throw {message: 'DOM Parent ill defined.', args: arguments};
  }

  this.domParentElement = domParentElement;
  this.domParentD3 = d3.select(this.domParentElement);

  var parentSelection = this.domParentD3.append('div')
    .style('width', size+'px')
    .style('height', size+'px');

  // initialize svg element
  app.svgSelection = parentSelection.append('svg')
    .attr('viewBox', '0 0 '+size+' '+size)
    .classed('fill-parent', true);

  // create background rect
  app.bgRectSelection = app.svgSelection.append('rect')
    .classed('fill-parent', true)
    .classed('invisible-mouse-capture', true);

  // create world origin
  app.worldOrigin = app.svgSelection.append('g');
  app.background = app.worldOrigin.append('g');
  app.foreground = app.worldOrigin.append('g');
}

module.exports = Visualization;

