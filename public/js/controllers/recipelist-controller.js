'use strict';

(function() {
  var recipelist = angular.module('recipeers.recipelist');

  recipelist.controller('RecipeListController', ['$scope','$http', 'socket', '_', 'csbc', 'RecipeListService', 'AuthService', function($scope, $http, socket, _, csbc, RecipeListService, AuthService) {

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
      RecipeListService.obs().set({
        mode: 'add',
        values: [{
          title: recipeListState.formData.title,
          description: recipeListState.formData.description,
          userID: AuthService.get().userID,
          userName: AuthService.get().userName,
          rid: '',
          timestamp: '',
          members: '',
          limit: recipeListState.formData.limit
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
      timestamp: null
    };

    if (_.truthy(RecipeListService.obs())) {
      RecipeListService.obs().addUpdates([update]);
      update(RecipeListService.obs().get());
    } else {
      RecipeListService.addUpdates(update);
    }

  }]);

})();
