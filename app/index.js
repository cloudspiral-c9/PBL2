
var ServerHelper = require( __dirname + '/server/ServerHelper.js').ServerHelper;
var SocketHelper = require( __dirname + '/socket/SocketHelper.js').SocketHelper;

(function() {
	var server = ServerHelper.startServer();
	SocketHelper.activateSocket(server);
})();
