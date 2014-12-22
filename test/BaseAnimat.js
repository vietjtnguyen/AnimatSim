var mocha = require('mocha');
var chai = require('chai');

var expect = chai.expect;

var _ = require('lodash');

describe('The BaseAnimat module', function() {
  var BaseAnimat = require('../src/js/BaseAnimat');
  it('should contain the BaseAnimat class', function() {
    expect(BaseAnimat.name).to.equal('BaseAnimat');
    var baseAnimat = new BaseAnimat();
    expect(baseAnimat).to.exist();
  });

  describe('The BaseAnimat class', function() {
    it('should construct with sensible defaults', function() {
      var baseAnimat = new BaseAnimat();
      expect(baseAnimat.ticks).to.equal(BaseAnimat.defaultSettings.ticks);
      expect(baseAnimat.x).to.equal(BaseAnimat.defaultSettings.x);
      expect(baseAnimat.y).to.equal(BaseAnimat.defaultSettings.y);
      expect(baseAnimat.dir).to.equal(BaseAnimat.defaultSettings.dir);
      expect(baseAnimat.customReset).to.equal(BaseAnimat.defaultSettings.customReset);
    });
    it('should accept settings to override defaults', function() {
      var settings = {
        ticks: 1,
        x: 2,
        y: 3,
        dir: 4,
        customReset: function() { return; }
      };
      var baseAnimat = new BaseAnimat(settings);
      expect(baseAnimat.ticks).to.equal(settings.ticks);
      expect(baseAnimat.x).to.equal(settings.x);
      expect(baseAnimat.y).to.equal(settings.y);
      expect(baseAnimat.dir).to.equal(settings.dir);
      expect(baseAnimat.customReset).to.equal(settings.customReset);
    });
    it('should assign each animat a unique ID', function() {
      var baseAnimats = _.times(100, function() { return new BaseAnimat(); });
      var baseAnimatIds = _.pluck(baseAnimats, 'id');
      var uniqueBaseAnimatIds = _.uniq(baseAnimatIds);
      expect(baseAnimatIds.length).to.equal(uniqueBaseAnimatIds.length);
    });
    it('should advance ticks on simulation step', function() {
      var baseAnimat = new BaseAnimat();
      var prevTicks = baseAnimat.ticks;
      baseAnimat.step();
      expect(baseAnimat.ticks).to.equal(prevTicks + 1);
    });
  });
});

