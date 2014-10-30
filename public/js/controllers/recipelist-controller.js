'use strict';

(function() {
    var recipelist = angular.module('recipeers.recipelist', []);

    recipelist.controller('RecipeListController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

        var recipelistObs;

        $scope.formData = {
            rid: '',
            content: '',
            description: "",
            author: '',
            date: null
        };

        $scope.submitRecipelist = function() {
            recipelistObs.set({
                mode: 'add',
                values: {
                    content: $scope.formData.content,
                    description: $scope.formData.description,
                    author: '',
                    rid: '',
                    date: new Date()
                }
            });
            $scope.formData = {
                rid: '',
                content: '',
                description: "",
                author: '',
                date: null
            };
        };

        (function getC() {
            $http({
                method: 'get',
                url: '/recipelist',
                withCredentials: true
            }).
            success(function(receiveData, status) {
                recipelistObs = csbc.observable('recipelist', {
                    send: function(event, data) {
                        socket.emit(event, data);
                    },
                    receive: function(event, setReceived) {
                        socket.on(event, function(data) {
                            setReceived(data);
                        });
                    }
                }, ['content', 'author', 'description', 'rid', 'date']).start(receiveData, getC()).addUpdates([function(newValues, data) {
                    $scope.recipelist = newValues;
                }]);
            }).
            error(function(data, status) {
                getC();
            });
        })();

    }]);

    recipelist.filter('hasValue', function() {
        return function(input, query) {
            var out = {};
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    for (var key2 in input[key]) {
                        if (input[key].hasOwnProperty(key2) && (input[key][key2].toString().indexOf(query) !== -1 || !query)) {
                            out[key] = input[key];
                        }
                    }
                }
            }
            return out;
        };
    });

})();
