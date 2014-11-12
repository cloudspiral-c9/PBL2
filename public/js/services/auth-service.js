'use strict';

(function() {

  var auth = angular.module('auth');

  auth.service('AuthService', ['_', function(_) {

    var userID, userName;

    userID = null;
    userName = null;

    function _set(userInfo) {
      if (!_.isObject(userInfo) || !_.truthy(userInfo.userID) || !_.truthy(userInfo.userName)) {
        return false;
      }
      userID = userInfo.userID;
      userName = userInfo.userName;

      return true;
    }

    function _get(userInfo) {
      return {
        userID: userID,
        userName: userName
      };
    }

    function _isLogged() {
      return (_.truthy(userID) && _.truthy(userName));
    }

    function _logout() {
      userID = null;
      userName = null;
    }

    return {
      get: _get,
      set: _set,
      isLogged: _isLogged,
      logout: _logout
    };

  }]);
})();
