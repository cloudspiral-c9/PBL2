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
                    content: '',
                };
            }
        };

        $scope.submitProcess = function(mode, index) {
            if (mode === 'edit' || mode === 'insert') {
                processesObs.set({
                    mode: mode,
                    index: index,
                    values: [{
                        content: $scope.formData[mode][index].content,
                        author: '',
                        date: new Date()
                    }]
                });
                $scope.show[mode][index] = '';
                $scope.formData[mode][index] = {
                    content: '',
                };
            } else if (mode === 'add') {
                processesObs.set({
                    mode: mode,
                    values: [{
                        content: $scope.formData[mode].content,
                        author: '',
                        date: new Date()
                    }]
                });
            } else if (mode === 'delete') {
                processesObs.set({
                    mode: mode,
                    index: index
                });
            }
        };

        function updateForm(newValues, data) {
            if (data.mode === 'delete') {
                $scope.formData.edit.splice(data.index, 1);
                $scope.formData.insert.splice(data.index, 1);
            } else if (data.mode === 'insert') {
                $scope.formData.edit.splice(data.index, 0, {
                    content: data.values[0].content,
                    author: data.values[0].author,
                    date: data.values[0].date,
                });
                $scope.formData.insert.splice(data.index, 0, {
                    content: data.values[0].content,
                    author: data.values[0].author,
                    date: data.values[0].date,
                });
            } else if (data.mode === 'add') {
                $scope.formData.edit.push({
                    content: '',
                });
                $scope.formData.insert.push({
                    content: '',
                });
            }
        }

        (function getC() {
            $http({
                method: 'get',
                url: '/processes',
                withCredentials: true
            }).
            success(function(receiveData, status) {
                processesObs = csbc.observable('processes', {
                    send: function(event, data) {
                        socket.emit(event, data);
                    },
                    receive: function(event, setReceived) {
                        socket.on(event, function(data) {
                            setReceived(data);
                        });
                    }
                }, ['content', 'author', 'date']).start(receiveData, getC()).addUpdates([function(newValues, data) {
                    $scope.processes = newValues;
                },updateForm]);
            }).
            error(function(data, status) {
                getC();
            });
        })();
    }]);
})();
