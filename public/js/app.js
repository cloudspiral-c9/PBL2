'use strict';

(function() {

  var recipeers = angular.module('recipeers');

  recipeers.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/list', {
      templateUrl: 'view/recipelist.html',
      controller: 'RecipeListController'
    }).
    when('/recipe/:recipeId', {
      templateUrl: 'view/recipe.html'
    }).
    otherwise({
      redirectTo: '/list'
    });
  }]);

})();
