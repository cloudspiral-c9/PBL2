'use strict';

(function() {
    var charts = angular.module('recipeers.recipe.chats', []);

    charts.controller('ChatsController', ['$scope', '$routeParams', '$http', 'socket', '_', 'csbc', function($scope, $routeParams, $http, socket, _, csbc) {

        var chatsObs;

        $scope.formData = {
            content: '',
            author: ''
        };

        $scope.submitChat = function() {
            if (_.truthy(chatsObs)) {
                chatsObs.set({
                    values: [{
                      content: $scope.formData.content,
                      author: $scope.formData.author
                    }],
                    mode: 'add'
                });
            }
            $scope.formData = {
                content: '',
                author: ''
            };
        };

        (function getC() {
            $http({
                method: 'get',
                url: '/chats',
                withCredentials: true
            }).
            success(function(receiveData, status) {
                chatsObs = csbc.observable('chats', {
                    send: function(event, data) {
                        socket.emit(event, data);
                    },
                    receive: function(event, setReceived) {
                        socket.on(event, function(data) {
                            setReceived(data);
                        });
                    }
                }, ['content', 'author', 'date']).start(receiveData, getC()).addUpdates([function(newValues, data) {
                    $scope.chats = newValues;
                }]);
            }).
            error(function(data, status) {
                getC();
            });
        })();
    }]);
})();
