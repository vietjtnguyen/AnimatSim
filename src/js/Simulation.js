function Simulation(environment, population) {
  var self = this;
  self.environment = environment;
  self.population = population;
  self.ticks = 0;
  self.ticksf = 0.0;
}

Simulation.prototype.step = function()
{
  var self = this;
  self.tick += 1;
  self.tickf += 1.0;
  self.environment.update();
  self.population.update();
};

module.exports = Simulation;

