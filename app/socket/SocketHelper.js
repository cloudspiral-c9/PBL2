'use strict';

var socketIO = require('socket.io');
var fs = require('fs');

var SocketHelper = {
	
	io: null,
	namespaces: [],

	activateSocket: function(server) {
		this._listen(server);
		this._loadSocketEventModules();
	},

	_listen: function(server) {
		this.io = socketIO.listen(server);
	},

	_loadSocketEventModules: function() {
		
		var readPath = __dirname + '/socket_event_modules';
		var fileNames = fs.readdirSync(readPath);
		var moduleFileNames = fileNames.filter(function(fileName) {
			return fs.statSync(readPath + '/' + fileName).isFile() && /.js$/.test(fileName);
		});

		var that = this;
		moduleFileNames.forEach(function(moduleName) {
			
			var module = require(readPath + '/' + moduleName)[moduleName.slice(0, -3)];
			
			var ns = module.ns;
			if (that.namespaces.indexOf(ns) != -1) {
				throw 'Already Exist ' + ns;
			}
			that.namespaces.push(ns);

			var subIO = that.io.of(ns);
			module.io = subIO;

			var eventHandlerMap = module.eventHandlerMap;
			subIO.on('connection', function(socket) {
				module.socket = socket;
				Object.keys(eventHandlerMap).forEach(function(eventName) {
					socket.on(eventName, eventHandlerMap[eventName]);
				});
			});
		});
	},
};

exports.SocketHelper = SocketHelper;