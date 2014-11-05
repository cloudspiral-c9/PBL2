
var http = require('http');
var url = require('url');
var fs = require('fs');
var app = require('express')();
var passport = require( __dirname + '/../services/login/passport.js' ).passport;

app.use(passport.initialize());
app.use(passport.session());

var ServerHelper = (function() {

	var _server = null;

	var _respondResult = function(response, result) {

		//レスポンスヘッダを記述
		var statusCode = (!result && result !== null) ? 500 : 200;

		var headers = {
			'Content-Type': 'application/json charset=UTF-8\n'
		}
		response.writeHead(statusCode, headers);

		//レスポンスボディを記述
		var encode = 'UTF-8';
		response.write(JSON.stringify(result) , encode);

		//レスポンスの終了
		response.end();
	};


	var _addRouteModule = function(module) {

		var route = module.route;
		app.get(route, function(request, response, next) {

			var parsedObject = url.parse(request.url, true);
			var path = parsedObject.pathname;
			var queries = parsedObject.query;

			module.request = request;
			module.response = response;
			module.next = next;

			console.log('request path: ' + path);
			var promise = module.routeFunc(queries);

			if (!promise) {
				return;
			}
			else {
				promise.done(function(result) {
					_respondResult(response, result);
				}, function(err) {
					console.log(err);
					_respondResult(response,err);
				})
			}
		});
	};

	var _loadRouteModules = function() {

		var readPath = __dirname + '/route_modules';
		var fileNames = fs.readdirSync(readPath);
		var moduleFileNames = fileNames.filter(function(fileName) {
			return fs.statSync(readPath + '/' + fileName).isFile() && /.js$/.test(fileName);
		});

		moduleFileNames.forEach(function(moduleName) {
			var routeModule = require(readPath + '/' + moduleName)[moduleName.slice(0, -3)];
			_addRouteModule(routeModule);
		});
	};

	var _createServer = function() {
		_server = http.createServer(app);
		console.log("Server Create");
	};

	var _listen = function() {
		var port = 8080;
		_server.listen(port, function() {
			console.log("Server Listen");
		});
	}

	var startServer = function() {
		_loadRouteModules();
		_createServer();
		_listen();
		return _server;
	};

	return {'startServer': startServer};

})();

exports.ServerHelper = ServerHelper;
