'use strict';

(function() {
  var charts = angular.module('recipeers.recipe.chats', []);

  charts.controller('ChatsController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

    var chatsObs;


    //ロジック部分(pure)
    function submit(chatsState){

      var rChatsState = csbc.deepClone(chatsState);

      rChatsState.formData = {
        message: '',
        sender: ''
      };

      return rChatsState;

    }

    //サーバーとの通信部分
    $scope.submitChat = function(chatsState) {
      if (_.truthy(chatsState.chatsObs)) {
        chatsState.chatsObs.set({
          values: [{
            message: chatsState.formData.message,
            sender: chatsState.formData.sender,
            timestamp: ''
          }],
          mode: 'add'
        });
      }

      return submit(chatsState);
    };


    //初期化
    $scope.chatasState = {};

    $scope.chatasState.formData = {
      message: '',
      sender: ''
    };

    $http({
      method: 'get',
      url: '/chats',
      withCredentials: true
    }).
    success(function(receiveData, status) {

      $scope.chatasState.chats = receiveData;

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
        $scope.chatasState.chats = newValues;
      }]);
    });

  }]);
})();
