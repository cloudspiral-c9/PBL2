'use strict';

(function() {

  angular.module('socket').factory('socket', ['$rootScope', '$q', '$timeout', function($rootScope, $q, $timeout) {
    var socket = io.connect();
    var id;
    var def = $q.defer();

    socket.on('ready', function(data){
      id = data.id;
      def.resolve();
    });

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
      }, 
      id: function(){
        return id;
      },
      promise: def.promise
    };
  }]);

})();
