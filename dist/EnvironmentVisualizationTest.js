var container = d3.select('body').append('div')
	.attr('style', 'width: 640px; height: 640px; margin: 0px; float: left;');

var svg = container.append('svg');
var svgEnvGroup = svg.append('g');

var env = new AnimatSim.Environment();
var vis = new AnimatSim.EnvironmentVisualization(svgEnvGroup, env);
var pop = null;

function update()
{
	env.step(pop);
	vis.render();
	setTimeout(update, 1);
}
update();
