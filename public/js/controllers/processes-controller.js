'use strict';

(function() {
  var processes = angular.module('recipeers.recipe.processes');

  processes.controller('ProcessesController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', 'AuthService', 'RecipeService', function($scope, $routeParams, $http, socket, _, csbc, AuthService, RecipeService) {

    var processesObs;

    //ロジック部分(pure)
    $scope.toD = function(ts){
      return new Date(ts);
    };

    $scope.showForm = function(processesState, mode, index) {

      var rProcessesState = csbc.deepClone(processesState);

      rProcessesState.show[mode][index] = 'show';
      if (!rProcessesState.formData[mode][index]) {
        rProcessesState.formData[mode][index] = {
          process: '',
        };
      }

      return rProcessesState;
    };

    function submit(processesState, mode, index) {

      var rProcessesState = csbc.deepClone(processesState);

      if (mode === 'insert') {
        rProcessesState.show[mode][index] = '';
        rProcessesState.formData[mode][index] = {
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
      }

      return rProcessesState;

    }

    function updateForm(processesState) {
      return function(newValues, data) {
        if (data.mode === 'remove') {
          processesState.formData.edit.splice(data.index, 1);
          processesState.formData.insert.splice(data.index, 1);
        } else if (data.mode === 'insert') {
          processesState.formData.edit.splice(data.index, 0, {
            process: data.values[0].process,
            sender: data.values[0].sender,
            timestamp: data.values[0].timestamp,
          });
          processesState.formData.insert.splice(data.index, 0, {
            process: data.values[0].process,
            sender: data.values[0].sender,
            timestamp: data.values[0].timestamp,
          });
        } else if (data.mode === 'add') {
          processesState.formData.edit.push({
            process: '',
          });
          processesState.formData.insert.push({
            process: '',
          });
        }
      };
    }

    //サーバーとの通信部分
    $scope.submitProcess = function(processesState, mode, index) {
      if (mode === 'insert') {
        processesObs.set({
          mode: mode,
          index: index,
          values: [{
            process: processesState.formData[mode][index].process,
            sender: AuthService.get().userName,
            timestamp: ''
          }]
        });
      } else if (mode === 'edit') {
        processesObs.set({
          mode: mode,
          index: index,
          values: [{
            process: processesState.formData[mode][index].process,
            sender: AuthService.get().userName,
            timestamp: ''
          }]
        });
      } else if (mode === 'add') {
        processesObs.set({
          mode: mode,
          values: [{
            process: processesState.formData[mode].process,
            sender: AuthService.get().userName,
            timestamp: ''
          }]
        });
      } else if (mode === 'remove') {
        processesObs.set({
          mode: mode,
          index: index
        });
      }

      return submit(processesState, mode, index);
    };

    //初期化
    $scope.processesState = {};
    $scope.processesState.show = {
      insert: [],
      edit: []
    };
    $scope.processesState.formData = {
      insert: [],
      edit: [],
      add: {}
    };

    $http.post('/getprocess', {
      rid: RecipeService.rid(),
      userID: AuthService.get().userID
    }).
    success(function(receiveData, status) {

      $scope.processesState.processes = receiveData;

      $scope.processesState.formData.edit = receiveData;

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
        $scope.processesState.processes = newValues;
      }, updateForm($scope.processesState)]);
    });

  }]);
})();
