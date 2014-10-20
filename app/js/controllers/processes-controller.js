'use strict';

(function () {
  var processes = angular.module('recipeers.recipe.processes', []);

  processes.controller('ProcessesController', ['$scope', '$routeParams', '$http', 'socket', 'RecipeService', function ($scope, $routeParams, $http, socket, recipe) {

    $scope.minusAddShow = '';
    $scope.processes = recipe.data.processes;
    $scope.show = {
      edit: [],
      add: []
    };
    $scope.formData = {
      edit: [],
      add: []
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
            content: mode === 'edit' ? $scope.processes[index].content : '',
            author: ''
          },
          index: index
        };
      }
    };

    function sendProcess(data) {
      data.value.date = new Date();
      socket.emit('sendProcess', data);
    }

    $scope.deleteRecipe = function (index) {
      sendProcess({
        rid: recipe.data.rid,
        mode: 'delete',
        index: index,
        value: {}
      });
    };

    $scope.submitProcess = function (mode, index) {
      sendProcess($scope.formData[mode][index]);
      $scope.show[mode][index] = '';
      $scope.formData[mode][index] = {
        rid: recipe.data.rid,
        mode: mode,
        value: {
          content: '',
          author: ''
        },
        index: index
      };
    };

    $scope.submitMinusAdd = function () {
      sendProcess({
        rid: recipe.data.rid,
        mode: 'add',
        value: {
          content: $scope.minusAddContent,
          author: ''
        },
        index: -1
      });
      $scope.minusAddShow = '';
    };

    socket.on('receiveProcess', function (newData) {
      var index;

      if (newData.rid === recipe.data.rid && newData.mode === 'add') {
        $scope.formData.edit.splice(newData.index + 1, 0, {

        });
        $scope.formData.add.splice(newData.index + 1, 0, {});
      } else if (newData.rid === recipe.data.rid && newData.mode === 'delete') {
        $scope.formData.edit.splice(newData.index, 1);
        $scope.formData.add.splice(newData.index, 1);
      }
      recipe.updateRecipeCurry('processes')(newData);

      index = newData.mode === 'edit' ? newData.index : newData.mode === 'add' ? newData.index + 1 : -1;
      if (index >= 0 && (!$scope.formData.edit[index].content || $scope.formData.edit[index].content !== '')) {
        $scope.formData.edit[index] = {
          rid: recipe.data.rid,
          mode: newData.mode,
          value: {
            content: newData.value.content,
            author: ''
          },
          index: index
        };
      }
    });
  }]);
})();
