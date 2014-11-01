'use strict';

(function() {
  var ingredients = angular.module('recipeers.recipe.ingredients', []);

  ingredients.controller('IngredientsController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

    var ingredientsObs;

    $scope.showEdit = [];
    $scope.formEdit = [];
    $scope.formAdd = {
      ingredient: '',
      amount: 0,
      sender: ''
    };

    $scope.showEditForm = function(index) {
      $scope.showEdit[index] = 'show';
      if (!$scope.formEdit[index]) {
        $scope.formEdit[index] = {
          ingredient: $scope.ingredients[index].ingredient,
          amount: $scope.ingredients[index].amount,
          sender: '',
          timestamp: ''
        };
      }
    };

    $scope.submitIngredient = function(mode, index) {
      if (_.truthy(ingredientsObs)) {
        if (mode === 'add') {
          ingredientsObs.set({
            values: [{
              ingredient: $scope.formAdd.ingredient,
              amount: $scope.formAdd.amount,
              sender: $scope.formAdd.sender,
              timestamp: ''
            }],
            mode: 'add'
          });
          $scope.formAdd = {
            ingredient: '',
            amount: 0,
            sender: ''
          };
        } else if (mode === 'edit') {
          ingredientsObs.set({
            values: [{
              ingredient: $scope.formEdit[index].ingredient,
              amount: $scope.formEdit[index].amount,
              sender: $scope.formEdit[index].sender,
              timestamp: ''
            }],
            mode: 'edit',
            index: index
          });
        } else if (mode === 'remove') {
          ingredientsObs.set({
            mode: 'remove',
            index: index
          });
        }
      }
    };

    function updateForm(newValues, data) {
      if (data.mode === 'add') {
        $scope.formEdit.push(data.values[0]);
      } else if (data.mode === 'remove') {
        $scope.formEdit.splice(data.index, 1);
      }
    }

    $http({
      method: 'get',
      url: '/ingredients',
      withCredentials: true
    }).
    success(function(receiveData, status) {

      $scope.ingredients = receiveData;

      ingredientsObs = csbc.observable('ingredients', {
        send: function(event, data) {
          socket.emit(event, data);
        },
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        }
      }, ['ingredient', 'sender', 'amount', 'timestamp']).start(receiveData).addUpdates([function(newValues, data) {
        $scope.ingredients = newValues;
      }, updateForm]);
    });

    $http({
      method: 'get',
      url: '/kinds',
      withCredentials: true
    }).
    success(function(receiveData, status) {
      $scope.kinds = receiveData;
    });

  }]);
})();
