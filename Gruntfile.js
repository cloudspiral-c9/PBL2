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
          'public/js/modules/module.js': ['coverage'],

          'public/js/mock/socket-mock.js': ['coverage'],
          'public/js/mock/ng-mock.js': ['coverage'],

          'public/js/lib/ng-underscore.js': ['coverage'],
          'public/js/lib/ng-socket.js': ['coverage'],
          'public/js/lib/ng-csbc.js': ['coverage'],

          'public/js/services/*.js': ['coverage'],

          'public/js/app.js': ['coverage'],
          'public/js/filters/*.js': ['coverage'],
          'public/js/controllers/*.js': ['coverage']
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
