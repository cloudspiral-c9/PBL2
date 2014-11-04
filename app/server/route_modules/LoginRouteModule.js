
var passport = require( __dirname + '/../../services/login/passport.js').passport;
var deferred = require('deferred');

var LoginRouteModule = {
	
	route: '/auth/google',
	routeFunc: function(queries) {

		var def = deferred();
		passport.authenticate('google');

		return def.promise;
	}
};

exports.LoginRouteModule = LoginRouteModule;