
var LoginMongoHelper = require( __dirname + '/../../services/login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');

var LogoutRouteModule = {
	
	route: '/logout',
	routeFunc: function(queries) {
		
		var def = deferred();

		if (!queries['userID']) {
			def.resolve(false);
			return def.promise;
		}

		var userId = queries['userID'];

		LoginMongoHelper.removeLoginUserId(userId)
		.done(function(result) {
			def.resolve(result);
		}, function(err) {
			def.resolve(false);
		});

		return def.promise;
	}

};

exports.LogoutRouteModule = LogoutRouteModule;
