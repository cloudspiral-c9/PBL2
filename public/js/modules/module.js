'use strict';

(function() {

  angular.module('underscore', []);
  angular.module('socket', []);
  angular.module('csbind', []);

  angular.module('recipeers', [
    'ngRoute',
    'ngMockE2E'
  ]);

  angular.module('recipeers.recipelist', [
    'socket',
    'underscore',
    'csbind'
  ]);

  angular.module('recipeers.recipe', [
    'underscore'
  ]);

  angular.module('recipeers.recipe.ingredients', [
    'socket',
    'underscore',
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
    'csbind'
  ]);

  angular.module('recipeers.recipe.chart', [
    'socket',
    'underscore',
    'csbind'
  ]);

})();
