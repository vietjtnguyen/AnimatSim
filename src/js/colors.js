var d3 = require('d3');

module.exports = {

  lerp: function(a, b, t) {
    return d3.rgb(
      a.r * (1.0 - t) + b.r * t,
      a.g * (1.0 - t) + b.g * t,
      a.b * (1.0 - t) + b.b * t);
  },

	rainbowColorScale: d3.scale.linear()
		.domain([0.0, 0.2, 0.4, 0.6, 0.8, 1.0])
		.range([
			d3.hsl(360*0.0, 1.0, 0.5),
			d3.hsl(360*0.2, 1.0, 0.5),
			d3.hsl(360*0.4, 1.0, 0.5),
			d3.hsl(360*0.6, 1.0, 0.5),
			d3.hsl(360*0.8, 1.0, 0.5),
			d3.hsl(360*1.0, 1.0, 1.0)
		]),

	greenRedColorScale: d3.scale.linear()
		.domain([0.0, 1.0])
		.range(['#00FF00', '#FF0000']),

	redGreenColorScale: d3.scale.linear()
		.domain([0.0, 1.0])
		.range(['#FF0000', '#00FF00']),

	terrainColorScale: d3.scale.linear()
		.domain([0.0, 0.12, 0.5, 0.8, 1.0])
		.range(['#E5D4C2', '#E5D4C2', '#AD8557', '#785440', '#F1F1EE']),

	waterColor: d3.rgb('#5278B6'),

	moistureColorScale: d3.scale.linear()
		.domain([0.0, 1.0])
		.range(['#E5C089', '#5278B6']),

	temperatureColorScale: d3.scale.linear()
		.domain([0.0, 0.2, 0.4, 0.6, 0.8, 1.0])
		.range([
			d3.hsl(360*1.0, 1.0, 1.0),
			d3.hsl(360*0.8, 1.0, 0.5),
			d3.hsl(360*0.6, 1.0, 0.5),
			d3.hsl(360*0.4, 1.0, 0.5),
			d3.hsl(360*0.2, 1.0, 0.5),
			d3.hsl(360*0.0, 1.0, 0.5)
		]),

	vegetationColorScale: d3.scale.linear()
		.domain([0.0, 1.0])
		.range(['#8BC89E', '#6B9A86']),

	animatDensityColorScale: d3.scale.linear()
		.domain([0.0, 0.5, 1.0, 5.0, 11.0, 20.0])
		.range([
			d3.hsl(360*0.0, 1.0, 0.5),
			d3.hsl(360*0.2, 1.0, 0.5),
			d3.hsl(360*0.4, 1.0, 0.5),
			d3.hsl(360*0.6, 1.0, 0.5),
			d3.hsl(360*0.8, 1.0, 0.5),
			d3.hsl(360*1.0, 1.0, 1.0)
		]),

	animatEnergyColorScale: d3.scale.linear()
		.domain([0.0, 20.0, 40.0, 60.0, 100.0])
		.range(['#DC7772', '#FACB7B', '#FFDD55', '#B3FF80', '#1763E0']),

  animatSwimmingColorScale: function(isSwimming)
  {
    return d3.rgb(isSwimming ? '#0000ff' : '#ffff00');
  },

	avoidanceColorScale: d3.scale.linear()
		.domain([-0.000030, 0.0, 0.000085])
		.range(['#FF0000', '#FFFF80', '#00FF00'])

};

