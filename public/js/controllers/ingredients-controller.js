'use strict';

(function() {
  var ingredients = angular.module('recipeers.recipe.ingredients', []);

  ingredients.controller('IngredientsController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

    var ingredientsObs;

    //ロジック部分(pure)
    $scope.showEditForm = function(ingredientsState, index) {

      var rIngredientsState = csbc.deepClone(ingredientsState);

      rIngredientsState.showEdit[index] = 'show';
      if (!rIngredientsState.formEdit[index]) {
        rIngredientsState.formEdit[index] = {
          ingredient: rIngredientsState.ingredients[index].ingredient,
          amount: rIngredientsState.ingredients[index].amount,
          sender: '',
          timestamp: ''
        };
      }

      return rIngredientsState;
    };

    function updateForm(ingredientsState) {
      return function(newValues, data) {
        if (data.mode === 'add') {
          ingredientsState.formEdit.push(data.values[0]);
        } else if (data.mode === 'remove') {
          ingredientsState.formEdit.splice(data.index, 1);
        }
      };
    }

    function submit(ingredientsState, mode, index) {

      var rIngredientsState = csbc.deepClone(ingredientsState);

      if (mode === 'add') {
        $scope.formAdd = {
          ingredient: '',
          amount: 0,
          sender: ''
        };
      }

      return rIngredientsState;
    }

    //サーバーとの通信部分
    $scope.submitIngredient = function(ingredientsState, mode, index) {
      if (_.truthy(ingredientsObs)) {
        if (mode === 'add') {
          ingredientsObs.set({
            values: [{
              ingredient: ingredientsState.formAdd.ingredient,
              amount: ingredientsState.formAdd.amount,
              sender: ingredientsState.formAdd.sender,
              timestamp: ''
            }],
            mode: 'add'
          });
        } else if (mode === 'edit') {
          ingredientsObs.set({
            values: [{
              ingredient: ingredientsState.formEdit[index].ingredient,
              amount: ingredientsState.formEdit[index].amount,
              sender: ingredientsState.formEdit[index].sender,
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

      return submit(ingredientsState, mode, index);
    };

    //初期化
    $scope.ingredientsState.showEdit = [];
    $scope.ingredientsState.formEdit = [];
    $scope.ingredientsState.formAdd = {
      ingredient: '',
      amount: 0,
      sender: ''
    };

    $http({
      method: 'get',
      url: '/kinds',
      withCredentials: true
    }).
    success(function(receiveData, status) {
      $scope.kinds = receiveData;
    });

    $http({
      method: 'get',
      url: '/ingredients',
      withCredentials: true
    }).
    success(function(receiveData, status) {

      $scope.ingredientsState.ingredients = receiveData;

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
        $scope.ingredientsState.ingredients = newValues;
      }, updateForm($scope.ingredientsState)]);
    });

  }]);
})();
