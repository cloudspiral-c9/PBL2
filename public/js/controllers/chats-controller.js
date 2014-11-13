'use strict';

(function() {
  var charts = angular.module('recipeers.recipe.chats', []);

  charts.controller('ChatsController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

    var chatsObs;

    $scope.formData = {
      message: '',
      sender: ''
    };

    $scope.submitChat = function() {
      if (_.truthy(chatsObs)) {
        chatsObs.set({
          values: [{
            message: $scope.formData.message,
            sender: $scope.formData.sender,
            timestamp: ''
          }],
          mode: 'add'
        });
      }
      $scope.formData = {
        message: '',
        sender: ''
      };
    };

    $http({
      method: 'get',
      url: '/chats',
      withCredentials: true
    }).
    success(function(receiveData, status) {

      $scope.chats = receiveData;

      chatsObs = csbc.observable('chats', {
        send: function(event, data) {
          socket.emit(event, data);
        },
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        }
      }, ['message', 'sender', 'timestamp']).start(receiveData).addUpdates([function(newValues, data) {
        $scope.chats = newValues;
      }]);
    });

  }]);
})();
