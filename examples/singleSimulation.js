var AnimatSim = require('animatsim');
var _ = AnimatSim.util;

var environmentSettings = {
  rows: 32,
  cols: 32,
  tileSize: 20,
  smoothness: 0.8
};

var enviroment = new AnimatSim.Environment(environmentSettings);

var populationSettings = {
  count: 400,
  brainFunc: AnimatSim.Brain.markIIb,
  resetFunc: function animatResetFunc(animat) {
    animat.dir = _.random(0.0, 2.0 * Math.PI);
    animat.x = environment.width * (0.5 + _.random(-0.02, 0.02));
    animat.y = environment.height * (0.5 + _.random(-0.02, 0.02));
    animat.energy = 100.0;
    animat.stomach = 1.0;
    animat.vulnerability = 0.0;
  }
};

var population = new AnimatSim.Population(populationSettings);

var simulationSettings = {
  maxTicks: 6000,
  deathTimeout: 500,
};

var simulation = new AnimatSim.Simulation(environment, population, simulationSettings);

simulation.run();

