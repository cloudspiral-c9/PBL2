'use strict';

var RoomManager = require( __dirname + '/../../services/login/RoomManager.js' ).RoomManager;
var TimestampHelper = require( __dirname + '/../../services/util/TimestampHelper.js');
var LoginMongoHelper = require( __dirname + '/../../services/login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');

var CreateRoomRouteModule = {

	route: '/newroom',
	routeFunc: function(queries) {
		
		var def = deferred();

		//クエリが不完全な場合は失敗フラグで終了
		if (!(queries.description && queries.title && queries.userID && queries.type ) ){
			def.resolve(false);
			return def.promise;
		}

		var description = queries.description;
		var title = queries.title;
		var userId = queries.userID;
		var type = queries.type;
		var limit = (!queries.limit) ? 200 : queries.limit;
		var userName = !queries.userName ? '': queries.userName;
		
		LoginMongoHelper.isLoggedIn(userId).done(function(isLoggedIn) {


			if (isLoggedIn) {

				RoomManager.createNewRoom(description, title, limit, userId, userName, type)

				.done(function(result) {
					def.resolve(result);
				}, 

				function(err) {
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

exports.CreateRoomRouteModule = CreateRoomRouteModule;
