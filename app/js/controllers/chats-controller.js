'use strict';

(function () {
  var charts = angular.module('recipeers.recipe.chats', []);

  charts.controller('ChatsController', ['$scope', '$routeParams', '$http', 'socket', 'RecipeService', function ($scope, $routeParams, $http, socket, recipe) {

    $scope.chats = recipe.data.chats;
    $scope.addShow = '';
    $scope.formData = {
      add: [{
        rid: recipe.data.rid,
        mode:'add',
        value: {
          content: '',
          author: ''
        }
      }]
    };

    function sendChat(data) {
      data.value.date = new Date();
      socket.emit('sendChat', data);
    }

    $scope.submitChat = function (mode, index) {
      $scope.formData[mode][0].index = index;
      sendChat($scope.formData[mode][0]);
      $scope.formData[mode][0] = {
        rid: recipe.data.rid,
        mode: 'add',
        value: {
          content: '',
          author: ''
        }
      };

    };

    socket.on('receiveChat', function (newData) {
      recipe.updateRecipeCurry('chats')(newData);
    });
  }]);
})();
