'use strict';

(function() {

  angular.module('socket').factory('socket', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    var socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;

          $timeout(function() {
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          }, 0);
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;

          $timeout(function() {
            $rootScope.$apply(function() {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          }, 0);
        });
      }
    };
  }]);

})();
