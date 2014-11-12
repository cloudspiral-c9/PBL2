'use strict';

var RecipeProcessMongoHelper = require( __dirname + '/../../services/process/RecipeProcessMongoHelper.js').RecipeProcessMongoHelper;
var LoginMongoHelper = require( __dirname + '/../../services/login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');


var GetRecipeProcessRouteModule = {
	
	route: '/getprocess',
	routeFunc: function(queries) {
		
		var def = deferred();

		if ( !(queries.rid && queries.userID) ) {
			def.resolve(false);
			return def;
		}

		var rid = +queries.rid;
		var userId = queries.userID;

		LoginMongoHelper.isLoggedIn(userId)
		.done(function(isLoggedIn) {

			if (isLoggedIn) {

				RecipeProcessMongoHelper.getRecipeProcesses(rid)
				.done(function(result) {
					def.resolve(result);
				}, function(err) {
					console.log(err);
					def.promise(false);
				});

			} else {
				def.promise(false);
			}

		}, function(err) {
			console.log(err);
			def.resolve(false);
		});

		return def.promise;
	}
};

exports.GetRecipeProcessRouteModule = GetRecipeProcessRouteModule;
