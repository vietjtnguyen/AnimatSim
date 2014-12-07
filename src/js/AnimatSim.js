var _ = require('./util');
var namespace = {};

namespace._ = _;
// namespace.$ = require('jquery'); // leave out jquery until I know I need it, it adds 100kb to browserified/uglified source
namespace.d3 = require('d3');
namespace.queryString = require('query-string');

_.forEach(
  [
    'Animat',
    'Brain',
    'Neuron',
    'Environment',
    'EnvironmentVisualization',
    'tileBrushes',
    'MeshGrid'
  ],
  function(module) {
  namespace[module] = require('./' + module);
});

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
