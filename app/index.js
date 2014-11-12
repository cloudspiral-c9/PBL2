'use strict';

var ServerHelper = require( __dirname + '/server/ServerHelper.js').ServerHelper;
var SocketHelper = require( __dirname + '/socket/SocketHelper.js').SocketHelper;

(function(ServerHelper, SocketHelper) {
	SocketHelper.activateSocket(ServerHelper.startServer());
})(ServerHelper, SocketHelper);
