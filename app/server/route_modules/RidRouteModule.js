
var RoomManager = require('RoomManager.js').RoomManager;
var deferred = require('deferred');

var RidRouteModule = {

	route: '/rid',
	routeFunc: function(queries) {
		
		var def = deferred();
		RoomManager.respondCurrentRid()

		.done(function(result) {
			def.resolve(result);
		}, 

		function(err) {
			def.resolve(false);
		});

		return def.promise;
	}
};

exports.RidRouteModule = RidRouteModule;