'use strict';

(function () {

  var recipe = angular.module('recipeers.recipe', [
    'recipeers.recipe.ingredients',
    'recipeers.recipe.processes',
    'recipeers.recipe.chats',
    'recipeers.recipe.chart',
  ]);

  recipe.filter('hasKey', function () {
    return function (input, query) {
      var out = {};
      for (var key in input) {
        if (input.hasOwnProperty(key) && (key.toString().indexOf(query) !== -1 || !query)) {
          out[key] = input[key];
        }
      }
      return out;
    };
  });

  recipe.filter('reverse', function () {
    return function (input, query) {
      return input.slice().reverse();
    };
  });
})();


