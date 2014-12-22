var _ = require('./util');

var Animat = require('./Animat');

/**
 * @classdesc Represents a population of animats, handling aggregate updates
 * and animat death.
 * @class
 */
function Population()
{
  var self = this;
  self.aliveAnimats = [];
  self.deadAnimats = [];
}

/**
 */
Population.prototype.add = function(animat)
{
  var self = this;
  self.aliveAnimats.push(animat);
};

/**
 */
Population.prototype.populate = function(numOfAnimats, animatFactory, replace)
{
  var self = this;
  if ( !_.isFunction(animatFactory) )
  {
    throw Error('Population.populate() requires a callable function for the animatFactory argument.');
  }
  // animatFactory = _.isFunction(animatFactory) ? animatFactory : function() { return new Animat(); };
  if ( replace )
  {
    self.aliveAnimats = _.times(numOfAnimats, animatFactory);
  }
  else
  {
    self.aliveAnimats = self.aliveAnimats.concat(_.times(numOfAnimats, animatFactory));
  }
};

/**
 */
Population.prototype.killAll = function()
{
  var self = this;
  while ( self.aliveAnimats.length > 0 )
  {
    self.deadAnimats.push(self.aliveAnimats.pop());
  }
};

/**
 */
Population.prototype.reset = function()
{
  
};

/**
 */
Population.prototype.step = function(environment)
{
  var i;
  for ( i = 0; i < this.aliveAnimats.length; i += 1 )
  {
    var animat = this.aliveAnimats[i];
    animat.step(environment);
    if( animat.energy <= 0.0 )
    {
      this.aliveAnimats.splice(i, 1);
      this.deadAnimats.push(animat);
      i -= 1;
    }
  }
};

// /**
//  */
// Population.prototype.serialize = function() {
//   var i;
//   var animat;
//   var animats = [];
//   for( i = 0; i < this.aliveAnimats.length; i += 1 )
//   {
//     animat = this.aliveAnimats[i];
//     animats.push({index: animat.index, genome: animat.brain.toGenome()});
//   }
//   for( i = 0; i < this.deadAnimats.length; i += 1 )
//   {
//     animat = this.deadAnimats[i];
//     animats.push({index: animat.index, genome: animat.brain.toGenome()});
//   }
//   var metaInfo = {
//     animatCounter: this.animatCounter,
//     generations: app.generations,
//   };
//   switch( app.defaultBrain )
//   {
//   case Brain.markI:
//     metaInfo.defaultBrain = 'markI';
//     break;
//   case Brain.markII:
//     metaInfo.defaultBrain = 'markII';
//     break;
//   case Brian.markIIb:
//     metaInfo.defaultBrain = 'markIIb';
//     break;
//   }
//   animats.push(metaInfo);
//   return JSON.stringify(animats, null, '\t');
// };

// /**
//  */
// Population.prototype.unserialize = function(animatData)
// {
//   var i;
//   var dataIndex = 0;
//   for( i = 0; i < this.aliveAnimats.length; i += 1 )
//   {
//     this.aliveAnimats[i].index = animatData[dataIndex].index;
//     this.aliveAnimats[i].brain.fromGenome(animatData[dataIndex].genome);
//     dataIndex += 1;
//   }
//   for( i = 0; i < this.deadAnimats.length; i += 1 )
//   {
//     this.deadAnimats[i].index = animatData[dataIndex].index;
//     this.deadAnimats[i].brain.fromGenome(animatData[dataIndex].genome);
//     dataIndex += 1;
//   }
//   var metaInfo = animatData[dataIndex];
//   dataIndex += 1;
//   this.animatCounter = metaInfo.animatCounter;
//   app.generations = metaInfo.generations;
//   if( metaInfo.defaultBrain !== undefined )
//   {
//     switch( metaInfo.defaultBrain )
//     {
//     case 'markI':
//       app.defaultBrain = Brain.markI;
//       log('Using brain "markI".');
//       break;
//     case 'markII':
//       app.defaultBrain = Brain.markII;
//       log('Using brain "markII".');
//       break;
//     case 'markIIb':
//       app.defaultBrain = Brain.markIIb;
//       log('Using brain "markIIb".');
//       break;
//     }
//   }
// };

module.exports = Population;

