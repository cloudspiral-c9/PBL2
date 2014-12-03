'use strict';

(function() {

	var headerModule = angular.module('recipeers.header');
	headerModule.controller('headerController', ['$scope', '$cookies', '$cookieStore', function($scope, $cookies, $cookiesStore) {
		
		var user = $cookiesStore.get('user');
		if (!user) {
			$scope.username = 'guest';
		}

		$scope.username = !user.userName ? 'guest' : user.userName;
	}]);

})();