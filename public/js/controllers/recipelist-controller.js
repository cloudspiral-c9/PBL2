'use strict';

(function() {
  var recipelist = angular.module('recipeers.recipelist');

  recipelist.controller('RecipeListController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

    var recipelistObs;

    //ロジック部分(pure)
    function submit(recipeListState) {

      var rRecipeListState = csbc.deepClone(recipeListState);

      rRecipeListState.formData = {
        rid: '',
        title: '',
        description: "",
        sender: '',
        timestamp: null
      };

      return rRecipeListState;

    }

    //サーバーとの通信部分
    $scope.submitRecipelist = function(recipeListState) {
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

      return submit(recipeListState);
    };

    //初期化
    $scope.recipeListState = {};
    $scope.recipeListState.formData = {
      rid: '',
      title: '',
      description: "",
      sender: '',
      timestamp: null
    };

    $http({
      method: 'get',
      url: '/recipelist',
      withCredentials: true
    }).
    success(function(receiveData, status) {

      $scope.recipeListState.recipelist = receiveData;

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
        $scope.recipeListState.recipelist = newValues;
      }]);
    });

  }]);

})();
