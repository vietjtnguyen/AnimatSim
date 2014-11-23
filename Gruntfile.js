module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/js/.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    browserify: {
      dist: {
        files: {"dist/animats.js": ["src/sim/js/animats.js"]}
      }
    },
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    //   },
    //   dist: {
    //     files: {
    //       'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
    //     }
    //   }
    // },
    jsdoc: {
      dist: {
        src: ['src/**/*.js', 'README.md'],
        options: {
          destination: './dist/docs'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        // globals: {
        //   jQuery: true,
        //   console: true,
        //   module: true,
        //   document: true
        // }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'mochaTest', 'jsdoc']
    }
  });

  grunt.registerTask('build', ['browserify']);//, 'concat', 'uglify']);
  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);

  grunt.registerTask('default', ['jsdoc', 'jshint', 'mochaTest']);
  // TODO: Add a documentation task.

};
