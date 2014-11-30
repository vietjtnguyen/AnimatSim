var env = new AnimatSim.Environment();
env.terrain.iterateVertices(function(value, arr, x, y) {
  arr[x][y] = y;
});
env.terrain.normalizeValues();

var pop = null;

var container = d3.select('body').append('div')
	.attr('style', 'width: ' + env.width + 'px ; height: ' + env.height + 'px ; margin: 0px; float: left;');
var svg = container.append('svg')
  .attr('id', 'animat-sim-vis')
  .attr('viewBox', '0 0 ' + env.width + ' ' + env.height)
  .classed('fill-parent', true);
var clickTarget = svg.append('rect')
  .attr('id', 'click-target')
  .classed('fill-parent', true)
  .classed('invisible-mouse-capture', true);
var origin = svg.append('g').attr('id', 'origin-group');
var background = origin.append('g').attr('id', 'bg-group');
var foreground = origin.append('g').attr('id', 'fg-group');

var vis = new AnimatSim.EnvironmentVisualization(background, env);

var brushIndex = 0;
var brushes = [
  AnimatSim.tileBrushes.terrain,
  AnimatSim.tileBrushes.temperature,
  AnimatSim.tileBrushes.moisture,
  AnimatSim.tileBrushes.vegetation
  // AnimatSim.tileBrushes.animatDensity // commented out because there is no population yet
];

window.onkeyup = function(arg)
{
	if ( arg.keyCode == 87 )
	{
	  brushIndex = _.incLoop(brushIndex, 0, brushes.length);
	}
	if ( arg.keyCode == 83 )
	{
	  brushIndex = _.decLoop(brushIndex, 0, brushes.length);
	}
};

function update()
{
	env.step(pop);
	vis.render(brushes[brushIndex]);
	setTimeout(update, 1);
}

update();
