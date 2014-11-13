'use strict';

(function() {

  angular.module('underscore', []);
  angular.module('socket', []);
  angular.module('csbind', []);

  angular.module('auth', ['underscore', 'ngCookies',]);

  angular.module('recipeers', [
    'ngRoute',
    'auth',
    'ngCookies',
    'recipeers.recipelist',
    'recipeers.recipe',
    'recipeers.recipe.ingredients',
    'recipeers.recipe.processes',
    'recipeers.recipe.chats',
    'recipeers.recipe.chart'
  ]);

  angular.module('recipeers.recipelist', [
    'socket',
    'underscore',
    'auth',
    'csbind',
    'recipeers.recipe',
    'recipeers'
  ]);

  angular.module('recipeers.recipe', [
    'auth',
    'underscore',
    'recipeers',
    'recipeers.recipelist',
  ]);

  angular.module('recipeers.recipe.ingredients', [
    'socket',
    'underscore',
    'recipeers.recipe',
    'csbind'
  ]);

  angular.module('recipeers.recipe.processes', [
    'socket',
    'underscore',
    'csbind'
  ]);

  angular.module('recipeers.recipe.chats', [
    'socket',
    'underscore',
    'recipeers.recipe',
    'csbind'
  ]);

  angular.module('recipeers.recipe.chart', [
    'socket',
    'underscore',
    'recipeers.recipe',
    'csbind'
  ]);

})();
