'use strict';

(function() {

  var recipeers = angular.module('recipeers');

  recipeers.config(['$routeProvider' ,'$cookieStore', 'AuthService', function($routeProvider, $cookieStore, AuthService) {

    AuthService.set($cookieStore.get('user'));

    $routeProvider.
    when('/list', {
      templateUrl: '/view/recipelist.html',
      controller: 'RecipeListController'
    }).
    when('/recipe/:recipeId', {
      templateUrl: '/view/recipe.html',
      requireLogin: true
    }).
    otherwise({
      redirectTo: '/list'
    });
  }]);

  recipeers.run(['$rootScope', '$routeParams', '$http', '$location', '$cookieStore', 'AuthService', 'RecipeListService', 'RecipeService', 'socket', function($rootScope, $routeParams, $http, $location, $cookieStore, AuthService, RecipeListService, RecipeService, socket) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.requireLogin && !AuthService.isLogged()) {
        event.preventDefault();
        alert('Please login.');
      }

      if (next.requireLogin && RecipeListService && RecipeListService.obs() && next.params.recipeId) {
        if (_.some(RecipeListService.obs().get(), function(value, i, list) {

            return value.rid === next.params.recipeId && _.isArray(value.members) && (value.members.length >= parseInt(value.limit));
          })) {
          event.preventDefault();
          alert('Limit over.');
        }
      }

      if (next.requireLogin && next.params.recipeId) {

        RecipeService.setRid(next.params.recipeId);

        socket.promise.then(function() {
          $http.post('/addmember', {
            socketID: socket.id(),
            rid: next.params.recipeId,
            userID: AuthService.get().userID
          });
        });
      }

      if (!next.rerqurieLogin && $routeParams.recipeId) {
        $http.post('/reducemember', {
          socketID: socket.id(),
          rid: $routeParams.rid,
          userID: AuthService.get().userID
        });
      }

    });
  }]);

})();
