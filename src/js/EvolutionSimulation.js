var Backbone = require('backbone');

var Animat = require('./animat');
var Brain = require('./brain');
var Environment = require('./environment');
var Population = require('./population');
var _ = require('./util');

function EvolutionSimulation(environment, population, settings)
{
  var self = this;

  var defaultValues = {
	  generations: 0,
	};
	_.defaults(self, settings, defaultSettings);

  self.environment = environment;
  self.population = population;
  self.simulation = new Simulation(self.environment, self.population);
}

_.extend(EvolutionSimulation.prototype, Backbone.Events);

EvolutionSimulation.prototype.step = function()
{
  var self = this;

  // TODO ANGRY GOD
  
  self.simulation.step();

  // self.trigger('preupdate');

  // self.trigger('postupdate');

  // time out
  var ticksSinceLastDeath = 0;
  if( app.population.deadAnimats.length > 0 )
  {
    ticksSinceLastDeath = app.tick - app.population.deadAnimats[app.population.deadAnimats.length - 1].ticks;
  }
  exports.ticksSinceLastDeath = ticksSinceLastDeath;
  if( app.tick >= 6000 || ticksSinceLastDeath >= 500 || self.population.aliveAnimats.length === 0 )
  {
    self.population.killAll();
    self.endGeneration();
  }
};

EvolutionSimulation.prototype.endGeneration = function() {
  var self = this;
  self.trigger('generationend');
  self.refreshEnvironment();
  self.reproduce();
};

EvolutionSimulation.prototype.refreshEnvironment = function() {
  var oldTerrain = app.environment.terrain.values;
  delete exports.environment;
  delete app.environment;
  exports.environment = app.environment = new Environment(app.numOfTiles, parseFloat(app.size) / parseFloat(app.numOfTiles), 0.8);
  if( !app.randomizeTerrainOnGeneration )
  {
    app.environment.terrain.values = oldTerrain;
  }
};

EvolutionSimulation.prototype.reproduce = function() {
  var percentageOfWinners = 0.3;
  var percentageOfLosers = 1.0 - percentageOfWinners;
  var percentageOfReincarnation = 0.3;
  var percentageOfChildren = 0.6;

  // Truncate the ones who die early (the losers), then shuffle and pair consecutive animats for sex
  var winners = app.population.deadAnimats;
  winners.splice(0, parseInt(winners.length * percentageOfLosers));
  winners.reverse();

  var highestTicks = 0;
  for( i = 0; i < winners.length; i += 1 )
  {
    highestTicks = Math.max(highestTicks, winners[i].ticks);
  }

  // Reincarnate a percentage of the winners
  for( i = 0; i < parseInt(winners.length * percentageOfReincarnation / percentageOfWinners); i += 1 )
  {
    app.population.aliveAnimats.push(winners[i]);
  }

  var child;

  // Second segment of population are the children of the winners
  while( app.population.aliveAnimats.length < parseInt(app.populationSize * (percentageOfReincarnation + percentageOfChildren)) )
  {
    // Select with preference to beginning of winner list (best scores)
    var aIndex = winners.length - 1;
    var aAnimat = winners[aIndex];
    for( i = 0; i < winners.length; i += 1 )
    {
      if( _.random(0, highestTicks * 2) < winners[i].ticks )
      {
        aIndex = i;
        aAnimat = winners[i];
        break;
      }
    }

    // Move the aIndex to the end of the winner list
    winners.push(winners.splice(aIndex, 1)[0]);

    // Select with preference to beginning of winner list (best scores)
    var bIndex = winners.length - 2;
    var bAnimat = winners[bIndex];
    for( i = 0; i < winners.length - 1; i += 1 )
    {
      if( _.random(0, highestTicks * 2) < winners[i].ticks )
      {
        bIndex = i;
        bAnimat = winners[i];
        break;
      }
    }

    // Move the bIndex to the end of the winner list
    winners.push(winners.splice(bIndex, 1)[0]);

    // Sexy time
    var aGenome = aAnimat.brain.toGenome();
    var bGenome = bAnimat.brain.toGenome();
    var childGenome = Brain.mixGenomes(aGenome, bGenome, 0.1, 0.01, 0.1, 0.01);

    child = new Animat(app.population.animatCounter);
    app.population.animatCounter += 1;
    child.brain.fromGenome(childGenome);
    app.population.aliveAnimats.push(child);
  }

  for( i = 0; i < app.population.aliveAnimats.length; i += 1 )
  {
    app.population.aliveAnimats[i].reset();
  }

  // Last segment of population are new random entrants
  while( app.population.aliveAnimats.length < app.populationSize )
  {
    child = new Animat(app.population.animatCounter);
    app.population.animatCounter += 1;
    app.population.aliveAnimats.push(child);
  }
};

EvolutionSimulation.prototype.restartSimulation = function() {
  log('Starting generation #'+(app.generations+1));

  // if( fs !== undefined && app.generations % app.numOfGenerationsBeforeSave === 0 )
  // {
  // 	outputFileName = (new Date()).toISOString().replace(/:/g, '-').replace(/\..+/g, '')+'-run.json';
  // 	log('Saving generation #'+(app.generations+1)+' to file "'+outputFileName+'"...');
  // 	var outputContents = exports.dump();
  // 	fs.writeFileSync(outputFileName, outputContents, 'utf8', function(err)
  // 		{
  // 			if( err )
  // 			{
  // 				log(err);
  // 			}
  // 			else
  // 			{
  // 				log('...saved!');
  // 			}
  // 		});
  // 	process.exit();
  // }

  // clear out dead animats list
  app.population.deadAnimats.length = 0;

  app.tick = 0;
  app.generations += 1;
  exports.generations = app.generations;

  app.environment.waterLevel = -0.2;
  app.calamity = {
    name: 'Nothing',
    waterLevel: 0.2,
    globalTemperature: 0.0,
    vegetationGrowthModifier: 0.0
  };
  app.calamityCountDown = 400;
  app.calamitySeverity = 0.0;
};

module.exports = animats;

