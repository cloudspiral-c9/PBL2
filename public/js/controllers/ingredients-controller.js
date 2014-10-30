'use strict';

(function() {
    var ingredients = angular.module('recipeers.recipe.ingredients', []);

    ingredients.controller('IngredientsController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

        var ingredientsObs;

        $scope.showEdit = [];
        $scope.formEdit = [];
        $scope.formAdd = {
            content: '',
            amount: 0,
            author: ''
        };

        $scope.showEditForm = function(index) {
            $scope.showEdit[index] = 'show';
            if (!$scope.formEdit[index]) {
                $scope.formEdit[index] = {
                    content: $scope.ingredients[index].content,
                    amount: $scope.ingredients[index].amount,
                    author: ''
                };
            }
        };

        $scope.submitIngredient = function(mode, index) {
            if (_.truthy(ingredientsObs)) {
                if (mode === 'add') {
                    ingredientsObs.set({
                        values: [{
                            content: $scope.formAdd.content,
                            amount: $scope.formAdd.amount,
                            author: $scope.formAdd.author,
                            date: new Date()
                        }],
                        mode: 'add'
                    });
                    $scope.formAdd = {
                        content: '',
                        amount: 0,
                        author: ''
                    };
                } else if (mode === 'edit') {
                    ingredientsObs.set({
                        values: [{
                            content: $scope.formEdit[index].content,
                            amount: $scope.formEdit[index].amount,
                            author: $scope.formEdit[index].author,
                            date: new Date()
                        }],
                        mode: 'add',
                        index: index
                    });
                    $scope.formEdit[index] = {
                        content: '',
                        amount: 0,
                        author: ''
                    };
                } else if (mode === 'delete') {
                    ingredientsObs.set({
                        mode: 'delete',
                        index: index
                    });
                }
            }
        };

        function updateForm(newValues, data) {
            if (data.mode === 'add') {
                $scope.formEdit.push(data.values[0]);
            } else if (data.mode === 'delete') {
                $scope.formEdit.splice(data.index, 1);
            }
        }

        (function getC() {
            $http({
                method: 'get',
                url: '/ingredients',
                withCredentials: true
            }).
            success(function(receiveData, status) {
                ingredientsObs = csbc.observable('ingredients', {
                    send: function(event, data) {
                        socket.emit(event, data);
                    },
                    receive: function(event, setReceived) {
                        socket.on(event, function(data) {
                            setReceived(data);
                        });
                    }
                }, ['content', 'author', 'amount', 'date']).start(receiveData, getC()).addUpdates([function(newValues, data) {
                    $scope.ingredients = newValues;
                },updateForm]);
            }).
            error(function(data, status) {
                getC();
            });
        })();

        (function getK() {
            $http({
                method: 'get',
                url: '/ingredients',
                withCredentials: true
            }).
            success(function(receiveData, status) {
                $scope.kinds = receiveData;
            }).
            error(function(data, status) {
                getK();
            });
        })();

    }]);
})();
