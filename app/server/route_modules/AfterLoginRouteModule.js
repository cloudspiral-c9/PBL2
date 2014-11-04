
var passport = require( __dirname + '/../../services/login/passport.js').passport;
var deferred = require('deferred');

var AfterLoginRouteModule = {
	
	route: '/auth/google/return',
	routeFunc: function(queries) {

		var def = deferred();

		var redirects = {
			successRedirect: '/',
			failureRedirect: '/login'
		};
		passport.authenticate('google', redirects);

		return def.promise;
	}
};

exports.AfterLoginRouteModule = AfterLoginRouteModule;