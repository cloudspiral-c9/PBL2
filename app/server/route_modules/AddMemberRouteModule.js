
var RoomManager = require( __dirname + '/../../services/login/RoomManager.js').RoomManager;
var deferred = require('deferred');

var AddMemberRouteModule = {

	route: '/addmember',
	request: null,
	routeFunc: function(queries) {
		
		var def = deferred();

		//クエリが不完全な場合は失敗フラグで終了
		if (!(queries['rid'] && queries['userID'] && this.request.user) ) {
			def.resolve(false);
			return def.promise;
		}

		var rid = +queries['rid'];
		var userId = queries['userID'];
		var userName = !queries['userName'] ? '' : queries['userName'];
		
		RoomManager.addMember(rid, userId, userName)
		.done(function(result) {
			def.resolve(result);
		}, 

		function(err) {
			console.log(err);
			def.resolve(false);
		});

		
		return def.promise;
	}
};

exports.AddMemberRouteModule = AddMemberRouteModule;
