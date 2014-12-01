var _ = require('./util');

/**
 * @classdesc
 * Behaviors encapsulate animat behaviors and can be attached to animats to
 * modify their state by sensing the environment and executing actions.
 * @arg {Object} settings - Specifies settings to override in animat (see {@link Behavior.defaultSettings}).
 * @class
 */
function Behavior(settings) {
  var self = this;

  // Apply default settings and specified settings.
	_.assign(self, Behavior.defaultSettings, _.pick(settings, Behavior.validSettingKeys));
}

Behavior.defaultSettings =
  {
  };

/**
 * Array of valid setting keys that will be [picked]{@link https://lodash.com/docs#pick} from the settings object passed to {@link Behavior}'s constructor. This array is [pulled]{@link https://lodash.com/docs#keys} from {@link Behavior.defaultSettings}.
 * @static
 */
Behavior.validSettingKeys = _.keys(Behavior.defaultSettings);

/**
 */
Behavior.prototype.update = function()
{
  var self = this;

  self.ticks += 1;

  // Gather local environmental information.
  self.farDist = app.environment.tileSize * 4.0; // maybe later make self an output neuron?
  self.farX = self.x + Math.cos(self.dir) * self.farDist;
  self.farY = self.y + Math.sin(self.dir) * self.farDist;

  self.altitude = app.environment.getValue(self.x, self.y, 'terrain');
  self.farAltitude = app.environment.getValue(self.farX, self.farY, 'terrain');
  self.swimming = self.altitude < app.environment.waterLevel;
  self.farWater = self.farAltitude < app.environment.waterLevel;
  self.slope = util.rotateVec(app.environment.getGradient(self.x, self.y, 'terrain'), -self.dir);

  self.temperature = app.environment.getValue(self.x, self.y, 'temperature');
  self.temperatureGradient = util.rotateVec(app.environment.getGradient(self.x, self.y, 'temperature'), -self.dir);

  self.moisture = app.environment.getValue(self.x, self.y, 'moisture');
  self.moistureGradient = util.rotateVec(app.environment.getGradient(self.x, self.y, 'moisture'), -self.dir);

  self.vegetation = app.environment.getValue(self.x, self.y, 'vegetation');
  self.farVegetation = app.environment.getValue(self.farX, self.farY, 'vegetation');
  self.vegetationGradient = util.rotateVec(app.environment.getGradient(self.x, self.y, 'vegetation'), -self.dir);

  self.animatDensity = _.clamp(app.environment.getValue(self.x, self.y, 'animatDensity') - 0.6, 0.0, app.populationSize);
  self.farAnimatDensity = _.clamp(app.environment.getValue(self.farX, self.farY, 'animatDensity') - 0.6, 0.0, app.populationSize);
  self.animatDensityGradient = util.rotateVec(app.environment.getGradient(self.x, self.y, 'animatDensity'), -self.dir);

  // Update sensors in the brain. Zero direction in self coordinate system is
  // at positive X. This means left is -Y, right is +Y, forward is +X, and
  // backward is -X.
  self.brain.leftSlope.setInput(-self.slope[1] * 1000.0);
  self.brain.rightSlope.setInput(self.slope[1] * 1000.0);
  self.brain.forwardSlope.setInput(self.slope[0] * 1000.0);
  self.brain.backwardSlope.setInput(-self.slope[0] * 1000.0);
  self.brain.temperature.setInput(self.temperature);
  self.brain.leftTemperatureGradient.setInput(-self.temperatureGradient[1] * 1000.0);
  self.brain.rightTemperatureGradient.setInput(self.temperatureGradient[1] * 1000.0);
  self.brain.forwardTemperatureGradient.setInput(self.temperatureGradient[0] * 1000.0);
  self.brain.backwardTemperatureGradient.setInput(-self.temperatureGradient[0] * 1000.0);
  self.brain.moisture.setInput(self.moisture);
  self.brain.leftMoistureGradient.setInput(-self.moistureGradient[1] * 1000.0);
  self.brain.rightMoistureGradient.setInput(self.moistureGradient[1] * 1000.0);
  self.brain.forwardMoistureGradient.setInput(self.moistureGradient[0] * 1000.0);
  self.brain.backwardMoistureGradient.setInput(-self.moistureGradient[0] * 1000.0);
  self.brain.vegetation.setInput(self.vegetation);
  self.brain.leftVegetationGradient.setInput(-self.vegetationGradient[1] * 1000.0);
  self.brain.rightVegetationGradient.setInput(self.vegetationGradient[1] * 1000.0);
  self.brain.forwardVegetationGradient.setInput(self.vegetationGradient[0] * 1000.0);
  self.brain.backwardVegetationGradient.setInput(-self.vegetationGradient[0] * 1000.0);

  if( self.brain.version == 'markII' || self.brain.version == 'markIIb' )
  {
    self.brain.altitude.setInput(self.altitude);
    self.brain.farAltitude.setInput(self.farAltitude);
    self.brain.farWater.setInput(self.farWater ? 1.0 : 0.0);
    self.brain.farVegetation.setInput(self.farVegetation);
    self.brain.farAnimatDensity.setInput(self.farAnimatDensity);

    self.brain.animatDensity.setInput(self.animatDensity);
    self.brain.leftAnimatDensityGradient.setInput(-self.animatDensityGradient[1]);
    self.brain.rightAnimatDensityGradient.setInput(self.animatDensityGradient[1]);
    self.brain.forwardAnimatDensityGradient.setInput(self.animatDensityGradient[0]);
    self.brain.backwardAnimatDensityGradient.setInput(-self.animatDensityGradient[0]);
  }

  // Update animat's internal state in the brain.
  self.brain.swimming.setInput(self.swimming ? 1.0 : 0.0);
  self.brain.energyLow.setInput(_.clamp((25.0 - self.energy) / 25.0 * 2.0, 0.0, 1.0));
  self.brain.energyHigh.setInput(_.clamp((self.energy - 75.0) / 25.0 * 2.0, 0.0, 1.0));
  self.brain.energyLevel.setInput(self.energy / 100.0);
  self.brain.stomach.setInput(self.stomach);
  self.brain.avoidance.setInput(self.distanceFromHistory / 10.0);

  // Execute brain behavior.
  self.brain.step();

  // Translate turning control (note the left-handed coordinate system).
  self.turnAmount = 0.0;
  self.turnAmount += self.brain.leanLeft.output * (Math.PI / 10.0 * 0.25);
  self.turnAmount += self.brain.turnLeft.output * (Math.PI / 10.0 * 1.0);
  self.turnAmount += self.brain.leanRight.output * -(Math.PI / 10.0 * 0.25);
  self.turnAmount += self.brain.turnRight.output * -(Math.PI / 10.0 * 1.0);

  // Translate movement control.
  self.moveAmount = 0.0;
  self.moveAmount += self.brain.walkForward.output * 0.3;
  self.moveAmount += self.brain.runForward.output * 1.2;
  self.moveAmount += -self.slope[0] * 100.0;
  self.moveAmount = _.clamp(self.moveAmount, 0.0, 3.0);

  // Eat
  self.eatAmount = self.brain.eat.output;
  self.eatAmount = _.clamp(Math.min(self.vegetation, self.eatAmount), 0.0, 1.0);
  self.moveAmount = self.moveAmount * (1.0 - self.eatAmount);

  // Swimming
  if( self.swimming )
  {
    if( self.moveAmount > 0.0 )
    {
      self.moveAmount = 0.3;
    }
    else
    {
      self.moveAmount = 0.0;
    }
    self.eatAmount = 0.0;
  }

  // Energy changes
  {
    var energyChange = 0.0;
    var energyMultiplier = 0.5;

    // Energy loss due to homeostasis.
    energyChange -= 0.45;
    
    // Energy loss due to temperature maintenance. If the local temperature is
    // between a range then no energy is lost maintaining temperature. Outside
    // that band the temperature maintenance scales.
    energyChange -= Math.pow(_.clamp(Math.abs(self.temperature - 0.43) - 0.08, 0.0, 1.0) / 0.5, 2.0) * 4.0;

    // Energy loss due to turning.
    energyChange -= Math.pow(Math.abs(self.turnAmount / 0.7), 1.5) * 0.25;

    // Energy loss due to movement.
    energyChange -= Math.pow(Math.abs(self.moveAmount / 1.5), 1.5) * 1.0;

    // Energy loss due to swimming.
    if( self.swimming )
    {
      energyChange -= 1.5;
    }

    // Energy loss due to eating.
    if( !self.swimming )
    {
      energyChange -= self.eatAmount * 1.0;
    }

    // Energy gain from digestion.
    if( self.stomach > 0.0 )
    {
      var digestedAmount = Math.min(self.stomach, 0.005);
      self.stomach = _.clamp(self.stomach - digestedAmount * energyMultiplier, 0.0, 1.0);
      energyChange += digestedAmount * 450.0;
    }

    // Extra energy loss due to starvation.
    if( self.stomach < 0.01 )
    {
      energyChange -= _.clamp(1.0 - self.stomach / 0.01, 0.0, 1.0) * 0.15;
    }

    // Store for internal state how much energy has changed.
    self.brain.energyLevel.setInput(self.energy / 100.0);

    self.energy = _.clamp(self.energy + energyChange * energyMultiplier, 0.0, 120.0);
  }

  // Execute animat motor control.
  self.dir += self.turnAmount;
  self.x += Math.cos(self.dir) * self.moveAmount;
  self.y += Math.sin(self.dir) * self.moveAmount;

  // Keep the animat inside the environment.
  self.x = Math.min(Math.max(self.x, 0), app.environment.size);
  self.y = Math.min(Math.max(self.y, 0), app.environment.size);

  // Maintain history
  var historyPreference = 0.9;
  self.xHistory = self.xHistory * historyPreference + self.x * (1.0 - historyPreference);
  self.yHistory = self.yHistory * historyPreference + self.y * (1.0 - historyPreference);

  // Eat.
  if( !self.swimming )
  {
    app.environment.addValue(self.x, self.y, self.eatAmount * -0.5, 'vegetation');
    self.stomach = _.clamp(self.stomach + self.eatAmount * 0.1, 0.0, 1.0);
  }

  // Update vulnerability.
  self.distanceFromHistory = Math.sqrt((self.x - self.xHistory) * (self.x - self.xHistory) + (self.y - self.yHistory) * (self.y - self.yHistory));
  self.avoidance = -0.00006 + self.distanceFromHistory * 0.00005 + _.clamp(self.animatDensity, 0.0, 3.0) * 0.000015;
  self.vulnerability = _.clamp(self.vulnerability - self.avoidance, 0.0, 0.03);
  if( Math.random() < self.vulnerability && !self.swimming )
  {
    self.energy -= 80.0;
    self.vulnerability *= 0.5;
  }
};

