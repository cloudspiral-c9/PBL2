'use strict';

var passport = require( __dirname + '/../../services/login/passport.js').passport;
var deferred = require('deferred');

var LoggedInRouteModule = {

	route: '/auth/google/callback',
	request: null,
	response: null,
	next: null,
	routeFunc: function(queries) {

		var def = deferred();

		//TODO failureRidirect
		var redirects = {
			successRedirect: 'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/',
			failureRedirect: '/'
		};

		var that = this;
		passport.authenticate('google', redirects, function(err, userObj) {

			if (err) {
				console.log(err);
				def.resolve(false);
				return;
			}

			var location =  'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/?user=' + JSON.stringify(userObj) + '\n';
			var headers = {
				'Content-Type': 'application/json charset=UTF-8\n',
				'Location': location
			};
			that.response.writeHead(302, headers);
			that.response.end();

		})(this.request, this.response, this.next);

	}
};

exports.LoggedInRouteModule = LoggedInRouteModule;