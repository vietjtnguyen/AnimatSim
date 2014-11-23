var AnimatSim = require('animatsim');

var environmentSettings = {
  rows: 32,
  cols: 32,
  tileSize: 20,
  smoothness: 0.8
};

var populationSettings = {
  count: 400,
  brainFunc: animat.Brain.markIIb,
  resetFunc: function animatResetFunc(animat) {
    animat.dir = util.randRange(0.0, Math.PI * 2.0);
    animat.x = environment.width * (0.5 + util.randRange(-0.02, 0.02));
    animat.y = environment.height * (0.5 + util.randRange(-0.02, 0.02));
    animat.energy = 100.0;
    animat.stomach = 1.0;
    animat.vulnerability = 0.0;
  }
};

var population = new animat.Population(populationSettings);
population.populateRandom(400);

var evolutionSettings = {
  environmentFunc: function (generation) {
    return new animat.Environment(environmentSettings);
  },
  evolutionFunc: animat.Evolution.mixers.standard
};

var evolutionSimulation = new AnimatSim.EvolutionSimulation(
  function(generation) {
    return new AnimatSim.Environment(environmentSettings);
  }, population);

evolution.step();
evolution.run();
evolution.runOneGeneration();
evolution.evolve();

