'use strict';

(function () {
  var recipelist = angular.module('recipeers.recipelist', []);

  recipelist.controller('RecipeListController', ['$scope', '$location', '$routeParams', '$http', 'socket', function ($scope, $location, $routeParams, $http, socket) {

    $scope.recipelist = socket.getRecipeListData();
    /*
    $http({
      method: 'get',
      url: '/recipelist,
      withCredentials: true
    }).
    success(function (receiveData, status) {
      $scope.recipelist = receiveData;
    }).
    error(function (data, status) {
      alert('RecipeListGetError');
    });*/

    $scope.move = function(movePath){
      $location.path(movePath);
    };

    socket.on('recipelistRecieve', function (data) {
      if (data.mode === 'delete') {
        delete $scope.recipelist[data.rid];
      } else if (data.mode === 'edit' && data.mode === 'add') {
        $scope.recipelist[data.rid] = data.value;
      }
    });

  }]);

  recipelist.filter('hasValue', function () {
    return function (input, query) {
      var out = {};
      for (var key in input) {
        if (input.hasOwnProperty(key)) {
          for(var key2 in input[key]){
            if(input[key].hasOwnProperty(key2) && (key2.toString().indexOf(query) !== -1 || input[key][key2].toString().indexOf(query) !== -1 || !query)){
              out[key] = input[key];
            }
          }
        }
      }
      return out;
    };
  });

})();
