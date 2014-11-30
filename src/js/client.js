var queryString = require('query-string');

// Force export to global namespace. Since everything will be wrapped up using
// Browserify the code here in encapsulated in a module namespace so anything
// loaded isn't available to the global namespace in the browser. Although
// having these things in the global namespace is not necessary, it makes it
// easier to manipulate and play with developer tools.
var _ = window._ = require('./util');
var AnimatSim = window.AnimatSim = require('./AnimatSim');

// Make sure we use the D3 already loaded in the browser global namespace
// because that one is associated with the actual DOM and not a shadow DOM.
var d3 = window ? window.d3 : require('d3');
var $ = window ? window.$ : require('jquery');

var simContainer = d3.select('body').append('div')
	.attr('style', 'width: 640px; height: 640px; margin: 0px; float: left;');

var defaultBrain = queryHash.brain;
if( defaultBrain === undefined )
{
	defaultBrain = 'markII';
}

var evoSim = new animat.EvolutionSimulation.quickInit(640.0, 32, 400, { container: simContainer, defaultBrain: defaultBrain });
var environmentVisualization = new animat.EnvironmentVisualization(evoSim.environment);

// var savedRunUrl = queryHash.save;
// if( savedRunUrl !== undefined )
// {
// 	animats.log('Downloading saved data "' + savedRunUrl + '"...');
// 	$.getJSON(savedRunUrl, function(data) {
// 	  animats.suck(data); animats.log('Loaded saved data from "' + savedRunUrl + '"!');
//   });
// }

// var dataLabelContainer = d3.select('body').append('div').attr('style', 'float: left;');

// var dataLabels = dataLabelContainer.selectAll('.data-label')
// 	.data([
// 		['Environment Display (cycle W/S): ', function(d)
// 			{
// 				switch( animats.settings.tileDisplayMode )
// 				{
// 				case animats.settings.ED_NORMAL:
// 					return 'Normal';
// 				case animats.settings.ED_TEMPERATURE_ONLY:
// 					return 'Temperature';
// 				case animats.settings.ED_MOISTURE_ONLY:
// 					return 'Moisture';
// 				case animats.settings.ED_VEGETATION_ONLY:
// 					return 'Vegetation';
// 				case animats.settings.ED_ANIMAT_DENSITY_ONLY:
// 					return 'Animat Density';
// 				}
// 			}],
// 		['Animat Display (cycle E/D): ', function(d)
// 			{
// 				switch( animats.settings.animatDisplayMode )
// 				{
// 				case animats.settings.AD_NORMAL:
// 					return 'Normal';
// 				case animats.settings.AD_SWIMMING_ONLY:
// 					return 'Swimming';
// 				case animats.settings.AD_EATING_ONLY:
// 					return 'Eating';
// 				case animats.settings.AD_STOMACH_ONLY:
// 					return 'Stomach';
// 				case animats.settings.AD_MOVING_ONLY:
// 					return 'Movement';
// 				case animats.settings.AD_VULNERABILITY_ONLY:
// 					return 'Vulnerability';
// 				case animats.settings.AD_DISTFROMHIST_ONLY:
// 					return 'Exploration';
// 				case animats.settings.AD_AVOIDANCE_ONLY:
// 					return 'Avoidance';
// 				}
// 			}],
// 		['Water Level (inc/dec R/F): ', function(d) { return animats.environment.waterLevel.toFixed(3); }],
// 		['Global Temperature (inc/dec T/G): ', function(d) { return animats.environment.globalTemperature.toFixed(3); }],
// 		['Calamity: ', function(d) { return animats.calamity.name + ' (' + animats.calamitySeverity.toFixed(2) + ')'; }],
// 		['Next Calamity: ', function(d) { return animats.calamityCountDown; }],
// 		['Sim Tick: ', function(d) { return animats.tick; }],
// 		['Animats Alive: ', function(d) { return animats.population.aliveAnimats.length + ' (' + animats.ticksSinceLastDeath + ')'; }],
// 		['Generations: ', function(d) { return animats.generations; }],
// 		['Visualization (toggle A): ', function(d) { return animats.settings.visualize ? 'On' : 'Off'; }],
// 	])
// 	.enter().append('p').classed('data-label', true);

// var logLabels = dataLabelContainer.selectAll('.log-label')
// 	.data(animats.logHistory)
// 	.enter().append('p').classed('log-label', true);

// window.onkeyup = function(arg)
// {
// 	if( arg.keyCode == 65 )
// 	{
// 		animats.settings.visualize = !animats.settings.visualize;
// 	}

// 	if( arg.keyCode == 87 )
// 	{
// 		animats.settings.tileDisplayMode = (animats.settings.tileDisplayMode + 1) % animats.settings.numOfEnvironmentDisplayModes;
// 	}
// 	if( arg.keyCode == 83 )
// 	{
// 		animats.settings.tileDisplayMode = (animats.settings.tileDisplayMode - 1 + animats.settings.numOfEnvironmentDisplayModes) % animats.settings.numOfEnvironmentDisplayModes;
// 	}

// 	if( arg.keyCode == 69 )
// 	{
// 		animats.settings.animatDisplayMode = (animats.settings.animatDisplayMode + 1) % animats.settings.numOfAnimatDisplayModes;
// 	}
// 	if( arg.keyCode == 68 )
// 	{
// 		animats.settings.animatDisplayMode = (animats.settings.animatDisplayMode - 1 + animats.settings.numOfAnimatDisplayModes) % animats.settings.numOfAnimatDisplayModes;
// 	}

// 	if( arg.keyCode == 82 )
// 	{
// 		animats.environment.waterLevel = _.clamp(animats.environment.waterLevel + 0.025, 0.0, 1.0);
// 	}
// 	if( arg.keyCode == 70 )
// 	{
// 		animats.environment.waterLevel = _.clamp(animats.environment.waterLevel - 0.025, 0.0, 1.0);
// 	}

// 	if( arg.keyCode == 84 )
// 	{
// 		animats.environment.globalTemperature = _.clamp(animats.environment.globalTemperature + 0.025, -1.0, 1.0);
// 	}
// 	if( arg.keyCode == 71 )
// 	{
// 		animats.environment.globalTemperature = _.clamp(animats.environment.globalTemperature - 0.025, -1.0, 1.0);
// 	}
// };

function update()
{
	evoSim.step();

	// dataLabels.text(function(d) { return d[0] + d[1](); });
	// logLabels.text(function(d, i) { return animats.logHistory[i]; });

	setTimeout(update, 1);
}
update();


