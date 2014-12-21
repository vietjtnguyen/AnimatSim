module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [
          { expand: true, cwd: 'src/css', src: '*.css', dest: 'dist/css/' },
          { expand: true, cwd: 'src', src: '*.html', dest: 'dist/' }
        ]
      }
    },
    // concat: {
    //   options: {
    //     separator: ';'
    //   },
    //   dist: {
    //     src: ['src/js/.js'],
    //     dest: 'dist/<%= pkg.name %>.js'
    //   }
    // },
    browserify: {
      dist: {
        files: {"dist/js/AnimatSim.js": ["src/js/AnimatSim.js"]}
      }
    },
    uglify: {
      // options: {
      //   banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      // },
      dist: {
        files: {
          'dist/js/AnimatSim.min.js': ['dist/js/AnimatSim.js']
        }
      }
    },
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
      tasks: ['jshint', 'mochaTest', /*'jsdoc',*/ 'browserify', 'uglify', 'copy']
    }
  });

  grunt.registerTask('build', ['browserify', 'uglify', 'copy']);
  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('default', ['jsdoc', 'jshint', 'mochaTest', 'browserify', 'uglify', 'copy']);
};
