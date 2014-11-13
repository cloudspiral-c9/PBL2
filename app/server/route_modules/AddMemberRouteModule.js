'use strict';

var RoomManager = require(__dirname + '/../../services/login/RoomManager.js').RoomManager;
var deferred = require('deferred');

var socket = require(__dirname + '/../../socket/socket.js');

var AddMemberRouteModule = {

  route: '/addmember',
  request: null,
  routeFunc: function(queries) {

    var def = deferred();

    //クエリが不完全な場合は失敗フラグで終了
    if (!(queries.rid && queries.userID && this.request.user && queries.socketID && socket.sockets()[queries.socketID])) {
      def.resolve(false);
      return def.promise;
    }

    var rid = +queries.rid;
    var userId = queries.userID;
    var userName = !queries.userName ? '' : queries.userName;

    RoomManager.addMember(rid, userId, userName)
      .done(function(result) {
          socket.sockets()[queries.socketID].join(rid);
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
