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
      var threshold = 0.5;
      var neuron = new Neuron(1.0, threshold, 1.0, 0.0);
      neuron.setInput(1.0);
      neuron.fire();
      expect(neuron.output).to.greaterThan(0.0);
    });
    it('should not fire and produce zero output when total input does not exceed threshold', function() {
      var threshold = 0.5;
      var neuron = new Neuron(1.0, threshold, 1.0, 0.0);
      neuron.setInput(0.0);
      neuron.fire();
      expect(neuron.output).to.equal(0.0);
    });
    it('should not reset input when processing inputs with no connections', function() {
      var neuron = new Neuron(1.0, 0.5, 1.0, 0.0);
      expect(neuron.connections).to.be.empty();
      neuron.setInput(1.234);
      expect(neuron.totalInput).to.equal(1.234);
      neuron.processInput();
      expect(neuron.totalInput).to.equal(1.234);
    });
    it('should be connectable to other neurons', function() {
      var neuronA = new Neuron(1.0, 0.5, 1.0, 0.0);
      var neuronB = new Neuron(1.0, 0.5, 1.0, 0.0);
      var neuronC = new Neuron(1.0, 0.5, 1.0, 0.0);
      expect(neuronA.connections).to.be.empty();
      neuronA.connect(neuronB, 1.0);
      neuronA.connect(neuronC, 1.0);
      expect(neuronA.connections.length).to.equal(2);
    });
    it('should respect connection strengths', function() {
      var neuronA = new Neuron(1.0, 0.5, 1.0, 0.0);
      var neuronB = new Neuron(1.0, 0.5, 1.0, 0.0);
      var neuronC = new Neuron(1.0, 0.5, 1.0, 0.0);
      neuronA.connect(neuronB, 1.0);
      neuronA.connect(neuronC, 0.0);
      neuronB.setInput(1.0);
      neuronC.setInput(1.0);
      neuronA.processInput();
      neuronA.fire();
      expect(neuronA.output).to.be.greaterThan(0.0);
      neuronB.setInput(1.0);
      neuronC.setInput(0.0);
      neuronA.processInput();
      neuronA.fire();
      expect(neuronA.output).to.be.greaterThan(0.0);
      neuronB.setInput(0.0);
      neuronC.setInput(1.0);
      neuronA.processInput();
      neuronA.fire();
      expect(neuronA.output).to.equal(0.0);
    });
  });
});


