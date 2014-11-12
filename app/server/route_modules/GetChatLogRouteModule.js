'use strict';

var ChatLogMongoHelper = require( __dirname + '/../../services/chat/ChatLogMongoHelper.js').ChatLogMongoHelper;
var LoginMongoHelper = require( __dirname + '/../../services/login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');

var GetChatLogRouteModule = {

	route: '/getchatlog',
	routeFunc: function(queries) {

		var def = deferred();

		if (! (queries.rid && queries.userID) ) {
			def.resolve(false);
			return def.promise;
		}

		var rid = +queries.rid;
		var pos = !queries.pos ? null: +queries.pos;
		var limit = !queries.limit ? null : +queries.limit;
		var userId = queries.userID;

		LoginMongoHelper.isLoggedIn(userId)
		.done(function(isLoggedIn) {

			if (isLoggedIn) {

				ChatLogMongoHelper.getChatLog(rid, pos, limit)
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

exports.GetChatLogRouteModule = GetChatLogRouteModule;
