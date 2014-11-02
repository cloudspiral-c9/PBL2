'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      dev: {},
      ci: {
        browsers: ['Firefox'],
        singleRun: true
      },
      coverage: {
        browsers: ['Firefox'],
        reporters: ['coverage'],
        preprocessors: {
          'js/app.js': ['coverage'],
          'js/**/*.js': ['coverage']
        },
        coverageReporter: {
          type: "lcov",
          dir: "coverage/"
        },
        singleRun: true
      }
    },
    coveralls: {
      options: {
        debug: true,
        coverage_dir: 'coverage'
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');

  grunt.registerTask('default', ['karma:ci']);
  grunt.registerTask('coverage', ['karma:coverage', 'coveralls']);
};