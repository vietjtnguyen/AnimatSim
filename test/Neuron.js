var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var _ = require('lodash');

describe('The Neuron module', function() {
  var Neuron = require('../src/js/Neuron');
  it('should contain the Neuron class', function() {
    expect(Neuron.name).to.equal('Neuron');
    var neuron = new Neuron();
    expect(neuron).to.exist();
  });

  describe('The Neuron class', function() {
    it('should fire and produce output when total input exceeds threshold', function() {
      var neuron = new Neuron(1.0, 0.0, 1.0, 0.0);
      neuron.setInput(1.5);
      neuron.fire();
      expect(neuron.output).to.greaterThan(0.0);
    });
    it('should not fire and produce zero output when total input does not exceed threshold', function() {
      var neuron = new Neuron(1.0, 0.0, 1.0, 0.0);
      neuron.setInput(0.5);
      neuron.fire();
      expect(neuron.output).to.equal(0.0);
    });
    it('should not reset input when processing inputs with no connections', function() {
      var neuron = new Neuron(1.0, 0.0, 1.0, 0.0);
      expect(neuron.connections).to.be.empty();
      neuron.setInput(1.234);
      expect(neuron.totalInput).to.equal(1.234);
      neuron.processInput();
      expect(neuron.totalInput).to.equal(1.234);
    });
    it('should accept settings to override defaults', function() {
      var settings = {
        ticks: 1,
        x: 2,
        y: 3,
        dir: 4,
        customReset: function() { return; }
      };
      var neuron = new Neuron(settings);
      expect(neuron.ticks).to.equal(settings.ticks);
      expect(neuron.x).to.equal(settings.x);
      expect(neuron.y).to.equal(settings.y);
      expect(neuron.dir).to.equal(settings.dir);
      expect(neuron.customReset).to.equal(settings.customReset);
    });
    it('should assign each animat a unique ID', function() {
      var baseAnimats = _.times(100, function() { return new Neuron(); });
      var baseAnimatIds = _.pluck(baseAnimats, 'id');
      var uniqueBaseAnimatIds = _.uniq(baseAnimatIds);
      expect(baseAnimatIds.length).to.equal(uniqueBaseAnimatIds.length);
    });
    it('should advance ticks on simulation step', function() {
      var neuron = new Neuron();
      var prevTicks = neuron.ticks;
      neuron.step();
      expect(neuron.ticks).to.equal(prevTicks + 1);
    });
    it('should complain if a non-callable ID generator is assigned', function() {
      expect(function() {
        var neuron = new Neuron({generateId: 1});
      }).to.throw(Error);
    });
  });
});


