var d3 = require('d3');

var _ = require('./util');
var colors = require('./colors');

var exports = {};

exports.TileTerrainBrush = function(tile, environment)
{
  if( tile.height < environment.waterLevel )
  {
    tile.color = colors.waterColor;
  }
  else
  {
    var t = _.clamp((tile.height - environment.waterLevel) / 0.025, 0.0, 1.0);
    var terrainColor = d3.rgb(colors.terrainColorScale(tile.height));
    var vegetationColor = d3.rgb(colors.vegetationColorScale(tile.height));
    var vegetationValue = environment.vegetation.values[tile.row][tile.col];
    tile.color = colors.lerp(colors.waterColor, colors.lerp(terrainColor, vegetationColor, vegetationValue), t);
  }
};

exports.TileTemperatureBrush = function(tile, environment)
{
  var temperature = environment.temperature.values[tile.row][tile.col];
  var temperatureColor = d3.rgb(colors.temperatureColorScale(temperature));
  tile.color = temperatureColor;
};

exports.TileMoistureBrush = function(tile, environment)
{
  var moisture = environment.moisture.values[tile.row][tile.col];
  var moistureColor = d3.rgb(colors.moistureColorScale(moisture));
  tile.color = moistureColor;
};

exports.TileVegetationBrush = function(tile, environment)
{
  var vegetation = environment.vegetation.values[tile.row][tile.col];
  var vegetationColor = d3.rgb(colors.vegetationColorScale(tile.height));
  tile.color = colors.lerp(d3.rgb(0, 0, 0), vegetationColor, vegetation);
};

exports.TileAnimatDensityBrush = function(tile, environment)
{
  var animatDensity = environment.animatDensity.values[tile.row][tile.col] / (app.populationSize * 0.05);
  var animatDensityColor = d3.rgb(colors.animatDensityColorScale(animatDensity));
  tile.color = colors.lerp(d3.rgb(0, 0, 0), animatDensityColor, Math.sqrt(animatDensity));
};

module.exports = exports;

