'use strict';

var ServerHelper = require( __dirname + '/server/ServerHelper.js').ServerHelper;
var socket = require( __dirname + '/socket/socket.js');

(function(ServerHelper, socket) {
	socket.start(ServerHelper.startServer());
})(ServerHelper, socket);
