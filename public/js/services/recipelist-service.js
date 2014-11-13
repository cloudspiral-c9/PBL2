'use strict';

(function() {
  var recipelist = angular.module('recipeers.recipelist');

  recipelist.service('RecipeListService', ['$http', 'socket', '_', 'csbc', 'AuthService', function($http, socket, _, csbc, AuthService) {

    var recipelistObs, recipelist, updates;

    updates = [];

    $http.post('/getroomlist', {
      type: 'all',
      userID: AuthService.get().userID
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
      }, ['title', 'userID', 'userName', 'description', 'rid', 'timestamp', 'members', 'limit']).start(receiveData).addUpdates(updates);

      if (!_.isEqual([], updates)) {
        _.each(updates, function(val) {
          val(receiveData);
        });
      }
    });

    return {
      obs: function() {
        return recipelistObs;
      },
      addUpdates: function(update) {
        updates.push(update);
      }
    };

  }]);

})();
