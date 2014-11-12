'use strict';

(function() {
  var recipelist = angular.module('recipeers.recipelist');

  recipelist.service('RecipeListService', ['$scope', '$http', 'socket', '_', 'csbc', function($scope, $http, socket, _, csbc) {

    var recipelistObs, recipelist, updates;

    updates = [];

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
      }, ['title', 'sender', 'description', 'rid', 'timestamp']).start(receiveData).addUpdates(updates);
    });

    return {
      obs: recipelistObs,
      updates: updates
    };

  }]);

})();
