'use strict';

(function() {
  var processes = angular.module('recipeers.recipe.processes', []);

  processes.controller('ProcessesController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

    var processesObs;

    $scope.show = {
      insert: [],
      edit: []
    };
    $scope.formData = {
      insert: [],
      edit: [],
      add: {}
    };

    $scope.showForm = function(mode, index) {
      $scope.show[mode][index] = 'show';
      if (!$scope.formData[mode][index]) {
        $scope.formData[mode][index] = {
          process: '',
        };
      }
    };

    $scope.submitProcess = function(mode, index) {
      if (mode === 'insert') {
        processesObs.set({
          mode: mode,
          index: index,
          values: [{
            process: $scope.formData[mode][index].process,
            sender: '',
            timestamp: ''
          }]
        });
        $scope.show[mode][index] = '';
        $scope.formData[mode][index] = {
          process: '',
        };
      } else if (mode === 'edit') {
        processesObs.set({
          mode: mode,
          index: index,
          values: [{
            process: $scope.formData[mode][index].process,
            sender: '',
            timestamp: ''
          }]
        });
      } else if (mode === 'add') {
        processesObs.set({
          mode: mode,
          values: [{
            process: $scope.formData[mode].process,
            sender: '',
            timestamp: ''
          }]
        });
      } else if (mode === 'remove') {
        processesObs.set({
          mode: mode,
          index: index
        });
      }
    };

    function updateForm(newValues, data) {
      if (data.mode === 'remove') {
        $scope.formData.edit.splice(data.index, 1);
        $scope.formData.insert.splice(data.index, 1);
      } else if (data.mode === 'insert') {
        $scope.formData.edit.splice(data.index, 0, {
          process: data.values[0].process,
          sender: data.values[0].sender,
          timestamp: data.values[0].timestamp,
        });
        $scope.formData.insert.splice(data.index, 0, {
          process: data.values[0].process,
          sender: data.values[0].sender,
          timestamp: data.values[0].timestamp,
        });
      } else if (data.mode === 'add') {
        $scope.formData.edit.push({
          process: '',
        });
        $scope.formData.insert.push({
          process: '',
        });
      }
    }

    $http({
      method: 'get',
      url: '/processes',
      withCredentials: true
    }).
    success(function(receiveData, status) {

      $scope.processes = receiveData;

      $scope.formData.edit = receiveData;

      processesObs = csbc.observable('processes', {
        send: function(event, data) {
          socket.emit(event, data);
        },
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        }
      }, ['process', 'sender', 'timestamp']).start(receiveData).addUpdates([function(newValues, data) {
        $scope.processes = newValues;
      }, updateForm]);
    });

  }]);
})();
