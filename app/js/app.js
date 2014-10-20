'use strict';

(function () {

  angular.module('underscore', []).factory('_', function () {
    return _;
  });

  var recipeers = angular.module('recipeers', [
    'ngRoute',
    'recipeers.recipe',
    'recipeers.recipelist',
    'underscore'
  ]);

  recipeers.factory('socket', function ($rootScope) {
    var socket = fake.mockSio;//io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      getRecipeData : function(){
        return socket.getRecipeData();
      },
      getIngredientsKinds : function(){
        return socket.getIngredientsKinds();
      },
      getRecipeListData: function(){
        return socket.getRecipeListData();
      }
    };
  });

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
