'use strict';

(function() {
  var charts = angular.module('recipeers.recipe.chats');

  charts.controller('ChatsController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', 'AuthService', 'RecipeService', function($scope, $routeParams, $http, socket, _, csbc, AuthService, RecipeService) {

    var chatsObs;


    //ロジック部分(pure)
    function submit(chatsState) {

      var rChatsState = csbc.deepClone(chatsState);

      rChatsState.formData = {
        message: '',
        sender: ''
      };

      return rChatsState;

    }

    $scope.toD = function(ts){
      return new Date(ts);
    };

    //サーバーとの通信部分
    $scope.submitChat = function(chatsState) {
      if (_.truthy(chatsObs)) {
        chatsObs.set({
          values: [{
            message: chatsState.formData.message,
            sender: AuthService.get().userName,
            timestamp: ''
          }],
          mode: 'add'
        });
      }

      return submit(chatsState);
    };


    //初期化
    $scope.chatsState = {};

    $scope.chatsState.formData = {
      message: '',
      sender: ''
    };

    $http.post('/getchatlog', {
      rid: RecipeService.rid(),
      userID: AuthService.get().userID
    }).
    success(function(receiveData, status) {

      $scope.chatsState.chats = receiveData;

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
        $scope.chatsState.chats = newValues;
      }]);
    });

  }]);
})();
