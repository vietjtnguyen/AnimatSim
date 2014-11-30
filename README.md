Animats
=======

Animats is a simple animat-agent simulation program built for fun. It supports simulation from command line for long jobs and simulation in a browser for visualization. The animats are controlled with a naive recurrent neural network and operate in a potentially dynamic environment. Optimization of animat behavior is done with a genetic algorithm.


Installation
============

1. Clone repository. `git clone`
2. Get dependencies. `npm install`

Introduction
============

Each simulation is defined by a number of settings. These settings are stored in a Javascript hash object (e.g. JSON object) which is often serialized as a JSON file. To run a simulation you must first define these settings.

Running the Program
===================

The program runs in two modes: pure simulation or visualization plus simulation. Pure simulation is run using the command line interface and runs entirely using Node.js. The visualization runs in the browser using your browser's Javascript engine to do the simulation while using the DOM and D3.js to do the visualization.

If you need to batch evolve populations to a certain generation or run experiments, I suggest using the command line interface. Although simulation is possible with the visualization it is not recommended because 1) it will likely run slower and 2) saving results is not as easy. That said, the visualization is the fun part!

Command Line
------------

The command line interface is somewhat of a cop out because it basically takes in a settings file and reads all pertinent arguments from that.

`node ./cli.js path/to/my/settings.json`

There's a good reason for this though. Visualizations are also fully specified by the same settings file. The details of this settings file are fleshed out in the next section.

Eventually each setting will be overridable via the command line interface so that whole runs can be fully specified with a command and relevant options and arguments.

Visualization
-------------

Visualizing your animats is the fun part of this program. The visualization runs entirely in your (modern) web browser and will perform both simulation and visualization. It'll should even work, albeit slowly, on your mobile.

The visualization is actually just a single HTML page with accompanying CSS and Javascript. 

Settings
========

There are two primary things that a settings files defines: the brain that animats start off with and how the terrain is generated. Secondary things that can be defined are how subsequent generations are generated and potentially some visualization settings.

If settings are not specified then the program will default to a "from scratch" simulation where the brains are randomly generated (uniformly across neuron parameters spaces) and the terrain is set to be dynamic and randomly generated.

```
{}
```

By default the program 

Background
==========

This project started off as an exploration of how animats fare when they're "raised" in different environment types and are transplanted. The environments are permutations are two axis: static/dynamic, saved/random.

The static/dynamic axis refers to whether or not the environment changes with the simulation. In a static simulation the environment does not change with respect to simulation time step (except vegetation which is consumed dynamically). In a dynamic simulation the environment undergoes a series of random but periodic calamities of increasing magnitude. Eventually the calamties become so calamitous that all animats will likely die.

The saved/random axis refers to environments that are randomly generated or loaded from a saved terrain.

My hypothesis was that animat populations raised in dynamic and random environments would be more "robust", hardened by the evolution in the face of calamity. To test this I raised populations in different environment types and transplanted them to see how they survived in other environment types. I was surprised to find that it was the population raised in static and random environments that fared the best when transplanted, not dynamic and random.
