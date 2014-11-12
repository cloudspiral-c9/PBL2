'use strict';

(function() {
  var recipelist = angular.module('recipeers.recipelist');

  recipelist.controller('RecipeListController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', 'RecipeListService', function($scope, $routeParams, $http, socket, _, csbc, RecipeListService) {

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
      RecipeListService.obs.set({
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

    function update(newValues, data) {
      $scope.recipeListState.recipelist = newValues;
    }

    //初期化
    $scope.recipeListState = {};
    $scope.recipeListState.formData = {
      rid: '',
      title: '',
      description: "",
      sender: '',
      timestamp: null
    };

    if (_.truthy(RecipeListService.obs)) {
      RecipeListService.obs.addUpdates([update]);
    } else {
      RecipeListService.updates.push(update);
    }


  }]);

})();
