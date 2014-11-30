var _ = require('./util');

function AngryGod(environment) {
  this.environment = environment;
	this.calamitySeverityIncrement = 0.05;
	this.calamityInterval = 400;
	this.calamityApproachRate = 0.01;
	var fireX, fireY;
	var oasisX, oasisY;
}

AngryGod.prototype.init = function() {
  app.environment.waterLevel = 0.0;
  app.calamity = {
    name: 'Nothing',
    waterLevel: 0.2,
    globalTemperature: 0.0,
    vegetationGrowthModifier: 0.0
  };
  app.calamityCountDown = 400;
  app.calamitySeverity = 0.0;
};

AngryGod.prototype.step = function() {
  // Spot fire
  if( this.tick % 120 == 1 )
  {
    fireX = _.random(0.0, this.environment.size);
    fireY = _.random(0.0, this.environment.size);
  }
  this.environment.addValue(fireX, fireY, 10.0, 'temperature');

  // Spot oasis
  if( this.tick % 120 == 1 )
  {
    oasisX = _.random(0.0, this.environment.size);
    oasisY = _.random(0.0, this.environment.size);
  }
  this.environment.addValue(oasisX, oasisY, 1.0, 'vegetation');

  // Calamity
  this.calamityCountDown -= 1;

  if( this.calamityCountDown <= 0 )
  {
    var calamityType = _.random(0, 4);
    switch( calamityType )
    {
    case 0: // flood
      this.calamity = {
        name: "Flood",
        waterLevel: _.clamp(0.2 + this.calamitySeverity * 0.5, 0.0, 1.0),
        globalTemperature: this.calamitySeverity * -0.1,
        vegetationGrowthModifier: 0.0,
      };
      break;
    case 1: // drought
      this.calamity = {
        name: "Drought",
        waterLevel: _.clamp(0.2 - this.calamitySeverity * 0.3, 0.0, 1.0),
        globalTemperature: this.calamitySeverity * 0.1,
        vegetationGrowthModifier: 0.0,
      };
      break;
    case 2: // heat wave
      this.calamity = {
        name: "Heat Wave",
        waterLevel: _.clamp(0.2 - this.calamitySeverity * 0.05, 0.0, 1.0),
        globalTemperature: this.calamitySeverity * 1.5,
        vegetationGrowthModifier: 0.0,
      };
      break;
    case 3: // cold snap
      this.calamity = {
        name: "Cold Snap",
        waterLevel: 0.2,
        globalTemperature: this.calamitySeverity * -1.5,
        vegetationGrowthModifier: 0.0,
      };
      break;
    case 4: // famine
      this.calamity = {
        name: "Famine",
        waterLevel: 0.2,
        globalTemperature: 0.0,
        vegetationGrowthModifier: this.calamitySeverity * -0.2,
      };
      break;
    }
    this.calamitySeverity += this.calamitySeverityIncrement;
    this.calamityCountDown = this.calamityInterval;
  }
  exports.calamity = this.calamity;
  exports.calamitySeverity = this.calamitySeverity;
  exports.calamityCountDown = this.calamityCountDown;

  // Environment tends towards calamity levels
  this.environment.waterLevel += (this.calamity.waterLevel - this.environment.waterLevel) * this.calamityApproachRate;
  this.environment.globalTemperature += (this.calamity.globalTemperature - this.environment.globalTemperature) * this.calamityApproachRate;
  this.environment.vegetationGrowthModifier += (this.calamity.vegetationGrowthModifier - this.environment.vegetationGrowthModifier) * this.calamityApproachRate;
};

module.exports = AngryGod;
