var d3 = require('d3');

var _ = require('./util');

var BaseEnvironment = require('./BaseEnvironment');
var MeshGrid = require('./MeshGrid.js');

/**
 * @classdesc
 * The default environment consists of five layers of information that affect
 * animats: terrain (e.g. height), temperature, moisture, vegetation, and
 * animat density. This environment has relatively complex interactions with
 * animats and within its own system. A fair warning to those browsing the
 * inner workings: there are a lot of magic numbers in here that were simply
 * hand tuned to achieve interesting behavior.
 * @augments BaseEnvironment
 * @class
 */
function Environment(settings)
{
  var self = this;

  // Call base constructor.
  Environment.base.call(self, settings);

  // Apply default settings and specified settings.
	_.assign(self, Environment.defaultSettings, _.pick(settings, Environment.validSettingKeys));

  this.terrain       = new MeshGrid(self.rows, self.tileSize, self.smoothness);
  this.temperature   = new MeshGrid(self.rows, self.tileSize, 1.0, function(value, arr, x, y) { arr[x][y] = 0.25; });
  this.moisture      = new MeshGrid(self.rows, self.tileSize, 1.0, function(value, arr, x, y) { arr[x][y] = 0.25; });
  this.vegetation    = new MeshGrid(self.rows, self.tileSize, 1.0, function(value, arr, x, y) { arr[x][y] = 0.0; });
  this.animatDensity = new MeshGrid(self.rows, self.tileSize, 1.0, function(value, arr, x, y) { arr[x][y] = 0.0; });

  // TODO: Update this so that it accounts for non-square environments.
  var numOfSeeds = parseInt(Math.pow(self.rows * 0.2, 2.0));
  this.vegetation.distributeSeeds(numOfSeeds, function(x, y) { return 1.0; });
}

// Set up prototype chain.
Environment.prototype = new BaseEnvironment();
Environment.base = BaseEnvironment;

/**
 * Static member object which contains default settings for {@link
 * Environment} construction.
 * @static
 */
Environment.defaultSettings =
  {
    /**
      * Terrain smoothness parameter. This is passed directly to [Xueqiao Xu's fractal terrain generator]{@link https://github.com/qiao/fractal-terrain-generator}.
      * @default 0.8
      * @member {float}
      * @memberof Environment.prototype
      */
    smoothness: 0.8,
    /**
      * Terrain smoothness parameter. This is passed directly to [Xueqiao Xu's fractal terrain generator]{@link https://github.com/qiao/fractal-terrain-generator}.
      * @default 0.8
      * @member {float}
      * @memberof Environment.prototype
      */
    globalTemperature: 0.0,
    temperatureDiffusionRate: 0.25,
    waterLevel: 0.2,
    moistureEvaporationRate: 0.03,
    moistureConsumptionPerVegetationRate: 0.03,
    vegetationGrowthModifier: 0.0,
    animatDensityDiffusionRate: 0.05,
    animatDensityDecayRate: 0.05,
    animatPresenceAmount: 0.15,
    altitudeToTemperatureScale: d3.scale.linear()
      .domain([0.0, 1.0])
      .range( [0.8, 0.05]),
    tempertureToMoistureLossScale: d3.scale.linear()
      .domain([0.0, 0.8,  1.0])
      .range( [0.2, 1.0, 30.0]),
    altitudeToMoistureLossScale: d3.scale.linear()
      .domain([0.0, 0.2, 0.45, 0.7, 0.9, 1.0])
      .range( [2.0, 1.0, 0.8,  1.0, 1.7, 2.0]),
    temperatureToVegetationFactor: d3.scale.linear()
      .domain([ 0.0,  0.2, 0.3, 0.4, 0.5,  0.8,  1.0])
      .range( [-2.0, -0.3, 0.7, 1.0, 0.7, -0.3, -2.0])
  };

/**
 * Array of valid setting keys that will be [picked]{@link
 * https://lodash.com/docs#pick} from the settings object passed to {@link
 * Environment}'s constructor. This array is [pulled]{@link
 * https://lodash.com/docs#keys} from {@link Environment.defaultSettings}.
 * @static
 */
Environment.validSettingKeys = _.keys(Environment.defaultSettings);

/**
 * This method performs a single simulation step. The simulation system uses no
 * tweening or time deltas and simply operates on constant time step ticks.
 * This method simply steps the simulation for moisture, temperature, and
 * vegetation. Animat density simulation is updated separately after the
 * Population update so that the Animats can "write" their density information
 * first before diffusion.
 * @arg {object} [population] An optional animat {@link Population} to update the
 * animat density with animat presence.
 */
Environment.prototype.step = function(population)
{
  var self = this;
  self.stepMoistureSimulation();
  self.stepTemperatureSimulation();
  self.stepVegetationSimulation();
  self.stepAnimatDensity(population);
};

/**
 * <p>Performs a moisture simulation step. Terrain submerged under water is at
 * full moister. Moisture evaporates at a rate dependent on altitude.
 * Vegetation consumes local moisture. Moisture also diffuses, but is penalized
 * when diffusing uphill.</p>
 *
 * <p>This is automatically called as part of {@link Environment#step} so it's
 * not really intended to be called by itself (thus the protected status).
 * However, those seeking more control are free to call it at will.</p>
 * @protected
 */
Environment.prototype.stepMoistureSimulation = function()
{
  var self = this;

  self.moisture.iterateVertices(function(value, arr, x, y)
  {
    var height = self.terrain.values[x][y];
    if ( height < self.waterLevel )
    {
      // Submerged means full moisture!
      arr[x][y] = 1.0;
    }
    else
    {
      // Evaporation effects.
      var temperature = self.temperature.values[x][y];
      value += -value * self.tempertureToMoistureLossScale(temperature) * self.altitudeToMoistureLossScale(height) * self.moistureEvaporationRate;

      // Vegetation uses up moisture as a resource.
      var vegetation = self.vegetation.values[x][y];
      value += -vegetation * self.moistureConsumptionPerVegetationRate;

      // Update moisture cell value.
      arr[x][y] = value;
    }
  });

  self.moisture.iterateNeighbors(function(value1, value2, arr, x1, y1, x2, y2, dist) {
    var h1 = self.terrain.values[x1][y1],
      h2 = self.terrain.values[x2][y2];
    var h = (h1 + h2) / 2.0;
    var slope = (h2 - h1) / dist;
    value1 += (value2 - value1) / dist * (1.0 - slope * 2.0) / 8.0 * 1.5 * (1.0 - h * 0.5);
    arr[x1][y1] = _.clamp(value1, 0.0, 1.0);
  });
};

/**
 * <p>Performs the temperature simulation step. Temperature diffuses, but also
 * tends towards a certain temperature based on the altitude of a cell. Water
 * cells act as heat sinks causing temperature to tend lower.</p>
 *
 * <p>This is automatically called as part of {@link Environment#step} so it's
 * not really intended to be called by itself (thus the protected status).
 * However, those seeking more control are free to call it at will.</p>
 * @protected
 */
Environment.prototype.stepTemperatureSimulation = function()
{
  var self = this;

  self.temperature.iterateNeighbors(function(value1, value2, arr, x1, y1, x2, y2, dist)
  {
    // Temperature diffusion (not a realistic model).
    value1 += (value2 - value1) / dist / 8.0 * self.temperatureDiffusionRate;
    arr[x1][y1] = _.clamp(value1, 0.0, 1.0);
  });

  self.temperature.iterateVertices(function(value, arr, x, y)
  {
    var height = self.terrain.values[x][y];
    var targetTemperature = self.globalTemperature;
    if( height < self.waterLevel )
    {
      // Water acts as a heat sink, modulating temperature.
      targetTemperature += 0.25;
      value += (targetTemperature - value) * 0.02;
    }
    else
    {
      // Temperature is affected by altitude with a simple try-to-be-this-
      // temperature-at-this-altitude model.
      targetTemperature += self.altitudeToTemperatureScale(height);
      value += (targetTemperature - value) * 0.01;
    }
    arr[x][y] = _.clamp(value, 0.0, 1.0);
  });
};

/**
 * <p>Performs the vegetation simulation step. Vegetation spreads to neighbors
 * (rather than diffuses) based on the availability of moisture and whether the
 * temperature level is comfortable. Being submerged kills vegetation. Lack of
 * moisture also kills vegetation. Also, vegetation is always present at the
 * water line in order to prevent complete vegetation ecological collapse.</p>
 *
 * <p>This is automatically called as part of {@link Environment#step} so it's
 * not really intended to be called by itself (thus the protected status).
 * However, those seeking more control are free to call it at will.</p>
 * @protected
 */
Environment.prototype.stepVegetationSimulation = function()
{
  var self = this;

  self.vegetation.iterateNeighbors(function(value1, value2, arr, x1, y1, x2, y2, dist)
  {
    // Spread based on temperature and moisture.
    var temperature = self.temperature.values[x1][y1];
    var moisture = self.moisture.values[x1][y1];
    value1 += (value2 - value1 * 0.8) / dist * 0.40 / (value1 * 2.0 + 1.0) * Math.random() * self.temperatureToVegetationFactor(temperature) * moisture;
    arr[x1][y1] = _.clamp(value1, 0.0, 1.0);
  });

  self.vegetation.iterateVertices(function(value, arr, x, y)
  {
    // Being under water kills off the vegetation based on the depth it is submerged.
    value += -_.clamp(self.waterLevel - self.terrain.values[x][y], 0.0, 1.0) * 2.0;

    // Vegetation die off due to lack of moisture.
    var moisture = self.moisture.values[x][y];
    value = _.clamp(value - (1.0 - moisture) * 0.01, 0.0, 1.0);

    // Controllable modifier.
    value = _.clamp(value + self.vegetationGrowthModifier, 0.0, 1.0);

    // Ensure there's a bit of vegetation near water always or else the vegetation can die out.
    var height = self.terrain.values[x][y];
    if ( height - self.waterLevel > 0.0 && height - self.waterLevel < 0.05 )
    {
      value = _.clamp(value, 0.3, 1.0);
    }
    
    arr[x][y] = value;
  });
};

/**
 * <p>Performs animat density simulation step. First diffuses any existing
 * animat density on the layer and then decays it. If a population is provided
 * the alive animats in the population will leave their presense on the animat
 * density layer.</p>
 *
 * <p>This is automatically called as part of {@link Environment#step} so it's
 * not really intended to be called by itself (thus the protected status).
 * However, those seeking more control are free to call it at will.</p>
 * @protected
 * @arg {object} [population] An optional animat {@link Population} to update the
 * animat density with animat presence.
 */
Environment.prototype.stepAnimatDensity = function(population)
{
  var self = this;

  self.animatDensity.iterateNeighbors(function(value1, value2, arr, x1, y1, x2, y2, dist)
  {
    // Diffusion (not a realistic model).
    value1 += (value2 - value1) / dist / 8.0 * self.animatDensityDiffusionRate;
    arr[x1][y1] = value1;
  });

  self.animatDensity.iterateVertices(function(value, arr, x, y)
  {
    // Decay.
    arr[x][y] *= (1.0 - self.animatDensityDecayRate);
  });

  // Go through alive animats and have them leave their "presense" on the
  // animat density layer.
  if (population) {
    for( i = 0; i < population.aliveAnimats.length; i += 1 )
    {
      self.addValue(population.aliveAnimats[i].x, population.aliveAnimats[i].y, self.animatPresenceAmount, 'animatDensity');
    }
  }
};

module.exports = Environment;

