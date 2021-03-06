var _ = require('./util');
var namespace = {};

namespace._ = _;
namespace.d3 = require('d3');

namespace.Environment = require('./Environment');
namespace.EnvironmentVisualization = require('./EnvironmentVisualization');
namespace.tileBrushes = require('./tileBrushes');
namespace.MeshGrid = require('./MeshGrid');

// Basically, if we're in a browser/client environment then we want to throw
// the exports into the global namespace. Otherwise we want to simply export
// the namespace as our module.
if ( _.isUndefined(window) )
{
  module.exports = namespace;
}
else
{
  // Export our namespace.
  window.AnimatSim = namespace;

  // Export a few third-party libraries into the global namespace for easier
  // access and debugging (as if the library sources were included in the HTML
  // page).
  window._ = namespace._;
  window.d3 = namespace.d3;
}
