'use strict';

(function () {
  var ingredients = angular.module('recipeers.recipe.ingredients', []);

  ingredients.controller('IngredientsController', ['$scope', '$routeParams', '$http', 'socket', 'RecipeService', function ($scope, $routeParams, $http, socket, recipe) {

    $scope.kinds = socket.getIngredientsKinds();
    /*
    $http({
      method: 'get',
      url: '/ingredientsKinds,
      withCredentials: true
    }).
    success(function (receiveData, status) {
      $scope.kinds = receiveData;
    }).
    error(function (data, status) {
      alert('IngredientsKindsGetError');
    });*/

    $scope.ingredients = recipe.data.ingredients;
    $scope.addShow = '';
    $scope.show = {
      edit: [],
      add: []
    };
    $scope.formData = {
      edit: [],
      add: [{
        rid: recipe.data.rid,
        mode: 'add',
        value: {
          content: '',
          amount: 0,
          author: ''
        }
      }]
    };

    $scope.showEditForm = function (mode, index) {
      $scope.show[mode][index] = 'show';
      if ($scope.formData[mode][index]) {
        $scope.formData[mode][index].mode = mode;
        $scope.formData[mode][index].index = index;
        $scope.formData[mode][index].rid = recipe.data.rid;
      } else {
        $scope.formData[mode][index] = {
          rid: recipe.data.rid,
          mode: mode,
          value: {
            content: mode === 'edit' ? $scope.ingredients[index].content : '',
            amount: mode === 'edit' ? $scope.ingredients[index].amount : 0,
            author: ''
          },
          index: index
        };
      }
    };

    function sendIngredient(data) {
      data.value.date = new Date();
      socket.emit('sendIngredient', data);
    }

    $scope.deleteIngredient = function (index) {
      sendIngredient({
        rid: recipe.data.rid,
        mode: 'delete',
        index: index,
        value: {}
      });
    };

    $scope.submitIngredient = function (mode, index) {
      if (mode !== 'add') {
        sendIngredient($scope.formData[mode][index]);
        $scope.show[mode][index] = '';
        $scope.formData[mode][index] = {
          rid: recipe.data.rid,
          mode: mode,
          value: {
            content: '',
            amount: 0,
            author: ''
          },
          index: index
        };
      } else {
        $scope.formData[mode][0].index = index;
        sendIngredient($scope.formData[mode][0]);
        $scope.formData[mode][0] = {
          rid: recipe.data.rid,
          mode: 'add',
          value: {
            content: '',
            amount: 0,
            author: ''
          }
        };
      }
    };

    socket.on('receiveIngredient', function (newData) {
      var index;

      if (newData.rid === recipe.data.rid && newData.mode === 'add') {
        $scope.formData.edit.splice(newData.index + 1, 0, {

        });
        $scope.formData.add.splice(newData.index + 1, 0, {});
      } else if (newData.rid === recipe.data.rid && newData.mode === 'delete') {
        $scope.formData.edit.splice(newData.index, 1);
        $scope.formData.add.splice(newData.index, 1);
      }
      recipe.updateRecipeCurry('ingredients')(newData);

      index = newData.mode === 'edit' ? newData.index : newData.mode === 'add' ? newData.index + 1 : -1;
      if (index >= 0 && (!$scope.formData.edit[index].content || $scope.formData.edit[index].content !== '')) {
        $scope.formData.edit[index] = {
          rid: recipe.data.rid,
          mode: newData.mode,
          value: {
            content: newData.value.content,
            amount: newData.value.amount,
            author: ''
          },
          index: index
        };
      }
    });
  }]);
})();
