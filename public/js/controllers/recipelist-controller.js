'use strict';

(function() {
  var recipelist = angular.module('recipeers.recipelist');

  recipelist.controller('RecipeListController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

    var recipelistObs;

    $scope.formData = {
      rid: '',
      title: '',
      description: "",
      sender: '',
      timestamp: null
    };

    $scope.submitRecipelist = function() {
      recipelistObs.set({
        mode: 'add',
        values: [{
          title: $scope.formData.title,
          description: $scope.formData.description,
          sender: '',
          rid: '',
          timestamp: ''
        }]
      });
      $scope.formData = {
        rid: '',
        title: '',
        description: "",
        sender: '',
        timestamp: null
      };
    };

    $http({
      method: 'get',
      url: '/recipelist',
      withCredentials: true
    }).
    success(function(receiveData, status) {

      $scope.recipelist = receiveData;

      recipelistObs = csbc.observable('recipelist', {
        send: function(event, data) {
          socket.emit(event, data);
        },
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        }
      }, ['title', 'sender', 'description', 'rid', 'timestamp']).start(receiveData).addUpdates([function(newValues, data) {
        $scope.recipelist = newValues;
      }]);
    });

  }]);

})();
