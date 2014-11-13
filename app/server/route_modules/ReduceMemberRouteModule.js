'use strict';

var RoomManager = require(__dirname + '/../../services/login/RoomManager.js').RoomManager;
var deferred = require('deferred');

var socket = require(__dirname + '/../../socket/socket.js');

var ReduceMemberRouteModule = {

  route: '/reducemember',
  routeFunc: function(queries) {

    var def = deferred();

    //クエリが不完全な場合は失敗フラグで終了
    if (!(queries.rid && queries.userID && queries.socketID && socket.sockets()[queries.socketID])) {
      def.resolve(false);
      return def.promise;
    }

    var rid = +queries.rid;
    var userId = queries.userID;
    RoomManager.removeMember(rid, userId)

    .done(function(result) {
        socket.sockets()[queries.socketID].leave(rid);
        def.resolve(result);
      },

      function(err) {
        console.log(err);
        def.resolve(false);
      });

    return def.promise;
  }
};

exports.ReduceMemberRouteModule = ReduceMemberRouteModule;
