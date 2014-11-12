'use strict';

var deferred = require('deferred');
var LoginMongoHelper = require( __dirname + '/../../services/login/LoginMongoHelper.js').LoginMongoHelper;
var IngredientMongoHelper = require( __dirname + '/../../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;

var GetIngredientRouteModule = {
	
	route: '/getingredient',
	routeFunc: function(queries) {

		var def = deferred();

		if ( !(queries.rid && queries.userID) ) {
			def.resolve(false);
			return def.promise;
		}

		var rid = +queries.rid;
		var userId = queries.userID;

		LoginMongoHelper.isLoggedIn(userId)
		.done(function(isLoggedIn) {

			if (isLoggedIn) {

				IngredientMongoHelper.getIngredients(rid)
				.done(function(result) {
					def.resolve(result);
				}, function(err) {
					console.log(err);
					def.resolve(false);
				});

			} else {
				def.resolve(false);
			}
			

		}, function(err) {
			console.log(err);
			def.resolve(false);
		});

		
		return def.promise;
	}	
};

exports.GetIngredientRouteModule = GetIngredientRouteModule;
