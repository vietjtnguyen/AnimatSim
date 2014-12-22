var _ = AnimatSim._;

var env = new AnimatSim.Environment();
env.terrain.iterateVertices(function(value, arr, x, y) {
  arr[x][y] = y;
});
env.terrain.normalizeValues();

var pop = new AnimatSim.Population();
pop.populate(400, function() {
  return new AnimatSim.Animat({
    customReset: function()
    {
      var self = this;
      self.dir = _.random(-0.1, 0.1);
      self.x = env.width * (0.5 + _.random(-0.02, 0.02));
      self.y = env.width * (0.5 + _.random(-0.02, 0.02));
    },
    brain: AnimatSim.generateDefaultBrain
  });
});
pop.reset();

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

var envVis = new AnimatSim.EnvironmentVisualization(background, env);
var popVis = new AnimatSim.PopulationVisualization(foreground, pop);

var envBrushIndex = 0;
var envBrushes = [
  AnimatSim.tileBrushes.terrain,
  AnimatSim.tileBrushes.temperature,
  AnimatSim.tileBrushes.moisture,
  AnimatSim.tileBrushes.vegetation,
  AnimatSim.tileBrushes.animatDensity
];

var popBrushIndex = 0;
var popBrushes = [
  AnimatSim.animatBrushes.energy,
  AnimatSim.animatBrushes.swimming,
  AnimatSim.animatBrushes.eating,
  AnimatSim.animatBrushes.stomach,
  AnimatSim.animatBrushes.moving,
  AnimatSim.animatBrushes.vulnerability,
  AnimatSim.animatBrushes.exporation,
  AnimatSim.animatBrushes.avoidance
];

window.onkeyup = function(arg)
{
	if ( arg.keyCode == 87 )
	{
	  envBrushIndex = _.incLoop(envBrushIndex, 0, envBrushes.length);
	}
	if ( arg.keyCode == 83 )
	{
	  envBrushIndex = _.decLoop(envBrushIndex, 0, envBrushes.length);
	}

	if ( arg.keyCode == 69 )
	{
	  popBrushIndex = _.incLoop(popBrushIndex, 0, popBrushes.length);
	}
	if ( arg.keyCode == 68 )
	{
	  popBrushIndex = _.decLoop(popBrushIndex, 0, popBrushes.length);
	}
};

function update()
{
	env.step(pop);
	pop.step(env);
  envVis.render(envBrushes[envBrushIndex]);
	popVis.render(popBrushes[popBrushIndex]);
	setTimeout(update, 1);
}

update();
