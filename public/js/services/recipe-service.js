'use strict';

(function() {
  var recipe = angular.module('recipeers.recipe');

  recipe.service('RecipeService', ['$scope', '$http', 'socket', '_', 'csbc','RecipeListService','AuthService', '$location', function($scope, $http, socket, _, csbc , RecipeListService, AuthService, $location) {

    var rid;

    function update(newValues, data){
      if(!_.some(newValues, function(value, i, list){
        return _.isEqual(value.rid, rid) && _.some(value.members, function(member, i, list){
        return _.isEqual(member, AuthService.get());
        });
      })){
        rid = null;
        $location.path("/");
      }
    }

    if (_.truthy(RecipeListService.obs)) {
      RecipeListService.obs.addUpdates([update]);
    } else {
      RecipeListService.updates.push(update);
    }

    return {
      rid:rid
    };

  }]);

})();
