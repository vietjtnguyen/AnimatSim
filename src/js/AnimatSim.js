var _ = require('./util');
var namespace = {};

namespace._ = _;
// namespace.$ = require('jquery'); // leave out jquery until I know I need it, it adds 100kb to browserified/uglified source
namespace.d3 = require('d3');
namespace.queryString = require('query-string');

// I tried wrapping this is a for loop so that only an array of module names
// would have to be specified but that appears to break Browserify.
namespace.Animat = require('./Animat');
namespace.Brain = require('./Brain');
namespace.BrainBuilder = require('./BrainBuilder');
namespace.Neuron = require('./Neuron');
namespace.generateDefaultBrain = require('./generateDefaultBrain');
namespace.Environment = require('./Environment');
namespace.EnvironmentVisualization = require('./EnvironmentVisualization');
namespace.tileBrushes = require('./tileBrushes');
namespace.MeshGrid = require('./MeshGrid');

// Basically, if we're in a browser/client environment then we want to put the
// exports into the global namespace, which in a browser/client situation is
// the window object. We can check if we're in a browser/client situation by
// checking if the window object exists or not. Otherwise we want to simply
// export the namespace as our module.
if ( _.isUndefined(window) )
{
  module.exports = namespace;
}
else
{
  window.AnimatSim = namespace;

  // Export a few third-party libraries into the global namespace directly for
  // easier access and debugging. This emulates including these libraries as
  // <script> includes in the HTML page. If this isn't done we would have to
  // access LoDash and D3 via AnimatSim._ and AnimatSim.d3 respectively (though
  // they are still available there anyway.
  window._ = namespace._;
  // window.$ = namespace.$;
  window.d3 = namespace.d3;
  window.queryString = namespace.queryString;
}
