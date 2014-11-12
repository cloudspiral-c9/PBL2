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
      templateUrl: 'view/recipe.html',
      requireLogin: true
    }).
    otherwise({
      redirectTo: '/list'
    });
  }]);

  recipeers.run(['$rootScope', '$rootParams', '$http','$location','AuthService', 'RecipeListService', function($rootScope, $rootParams, $http, $location,AuthService, RecipeListService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.requireLogin && !AuthService.islogged()) {
        event.preventDefault();
        alert('Please login.');
      }

      if (next.requireLogin && RecipeListService && $rootParams.rid) {
        if (_.some(RecipeListService.obs.get(), function(value, i, list) {

            return value.rid === $rootParams.rid && _.some(value, function(val, i) {
              return _.isArray(val.members) && (val.members.length >= parseInt(val.limit));
            });

          })) {
          event.preventDefault();
          alert('Limit over.');
        }
      }

      if (next.rereuieLogin) {
        $http.post({
          url: '/addmember',
          data: {
            rid:$rootParams.rid,
            userID : AuthService.get().userID
          },
          withCredentials: true
        }).
        success(function(receiveData, status) {
          if(!receiveData){
            $location.path('/');
            alert('Limit over.');
          }
        });
      }

      if (!next.rereuieLogin && $rootParams.rid) {
        $http.post({
          url: '/reducemember',
          data: {
            rid:$rootParams.rid,
            userID : AuthService.get().userID
          },
          withCredentials: true
        });
      }

    });
  }]);

})();
