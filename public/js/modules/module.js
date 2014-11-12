'use strict';

(function() {

  angular.module('underscore', []);
  angular.module('socket', []);
  angular.module('csbind', []);

  angular.modele('auth','underscore');

  angular.module('recipeers', [
    'ngRoute',
    'auth',
    'ngMockE2E'
  ]);

  angular.module('recipeers.recipelist', [
    'socket',
    'underscore',
    'auth',
    'csbind'
  ]);

  angular.module('recipeers.recipe', [
    'auth',
    'underscore',
    'recipeers.recipelist'
  ]);

  angular.module('recipeers.recipe.ingredients', [
    'socket',
    'underscore',
    'auth',
    'csbind'
  ]);

  angular.module('recipeers.recipe.processes', [
    'socket',
    'underscore',
    'auth',
    'csbind'
  ]);

  angular.module('recipeers.recipe.chats', [
    'socket',
    'underscore',
    'auth',
    'csbind'
  ]);

  angular.module('recipeers.recipe.chart', [
    'socket',
    'underscore',
    'auth',
    'csbind'
  ]);

})();
