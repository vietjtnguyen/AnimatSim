var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var _ = require('lodash');

describe('The Animat module', function() {
  var Animat = require('../src/js/Animat');
  it('should contain the Animat class', function() {
    expect(Animat.name).to.equal('Animat');
    var animat = new Animat();
    expect(animat).to.exist();
  });

  describe('The Animat class', function() {
    it('should construct with sensible defaults, including those from BaseAnimat', function() {
      var BaseAnimat = require('../src/js/BaseAnimat');
      var animat = new Animat();
      expect(animat.ticks).to.equal(BaseAnimat.defaultSettings.ticks);
      expect(animat.x).to.equal(BaseAnimat.defaultSettings.x);
      expect(animat.y).to.equal(BaseAnimat.defaultSettings.y);
      expect(animat.dir).to.equal(BaseAnimat.defaultSettings.dir);
      expect(animat.customReset).to.equal(BaseAnimat.defaultSettings.customReset);
      expect(animat.energy).to.equal(Animat.defaultSettings.energy);
      expect(animat.stomach).to.equal(Animat.defaultSettings.stomach);
      expect(animat.vulnerability).to.equal(Animat.defaultSettings.vulnerability);
    });
    it('should accept settings to override defaults, including those from BaseAnimat', function() {
      var settings = {
        brain: function() { return; },
        energy: 1,
        stomach: 2,
        vulnerability: 3,
        ticks: 1,
        x: 2,
        y: 3,
        dir: 4,
        customReset: function() { return; }
      };
      var animat = new Animat(settings);
      expect(animat.energy).to.equal(settings.energy);
      expect(animat.stomach).to.equal(settings.stomach);
      expect(animat.vulnerability).to.equal(settings.vulnerability);
      expect(animat.ticks).to.equal(settings.ticks);
      expect(animat.x).to.equal(settings.x);
      expect(animat.y).to.equal(settings.y);
      expect(animat.dir).to.equal(settings.dir);
      expect(animat.customReset).to.equal(settings.customReset);
    });
    it('should call the brain setting if it\'s a function and use it otherwise', function() {
      var settings = {
        brain: function() { return 'foobar'; }
      };
      var animat = new Animat(settings);
      expect(animat.brain).to.equal(settings.brain());
      settings = {
        brain: 123
      };
      animat = new Animat(settings);
      expect(animat.brain).to.equal(settings.brain);
    });
  });
});

