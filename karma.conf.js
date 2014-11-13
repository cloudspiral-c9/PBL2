'use strict';

module.exports = function(config) {
  config.set({

    basePath: './',

    files: [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-route/angular-route.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/bower_components/angular-cookies/angular-cookies.js',
      'public/bower_components/underscore/underscore.js',
      'public/bower_components/underscore-contrib/underscore.array.builders.js',
      'public/bower_components/underscore-contrib/underscore.object.builders.js',
      'public/bower_components/underscore-contrib/underscore.function.iterators.js',
      'public/bower_components/underscore-contrib/underscore.util.existential.js',
      'public/bower_components/underscore-contrib/underscore.object.selectors.js',
      'public/bower_components/csbind-client/csbind-client.js',

      'public/js/modules/module.js',

      'public/js/mock/socket-mock.js',
      'public/js/mock/ng-mock.js',

      'public/js/lib/ng-underscore.js',
      'public/js/lib/ng-socket.js',
      'public/js/lib/ng-csbc.js',

      'public/js/app.js',
      'public/js/**/*.js',
      'test/public/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: [
      'Chrome',
      'Firefox',
      'PhantomJS'
    ],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
       'karma-coverage',
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    //reporters: ['spec', 'growl'],

  });
};
