
var http = require('http');
var url = require('url');
var fs = require('fs');


var ServerHelper = (function() {

	var _routeFuncMap = new Object();
	var _server = null;

	var _addRouteModule = function(module) {

		if (_routeFuncMap[module.route]) {
			throw 'Already Exist ' + module.route;
		}
		
		_routeFuncMap[module.route] = module.routeFunc;	
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
		_server = http.createServer();
		console.log("Server Create");
	};

	var _respondResult = function(response, result) {

		//レスポンスヘッダを記述
		var statusCode = (!result && result !== null) ? 500 : 200;
	
		var headers = {
			'Content-Type': 'application/json charset=UTF-8\n'
		}
		response.writeHead(statusCode, headers);

		//レスポンスボディを記述
		var encode = 'UTF-8';
		response.write(JSON.stringify(result) + '\n', encode);
						
		//レスポンスの終了
		response.end();
	};

	var _registerRequestHandler = function() {
		
		if (!_server) {
			throw "Server Error";
		}

		_server.on('request', function(request, response) {

			if (request.method != 'GET') {
				return;
			}
	
			var parsedObject = url.parse(request.url, true);
			var path = parsedObject.pathname;
			var queries = parsedObject.query;

			console.log('request path: ' + path);

			if (_routeFuncMap[path]) {
				_routeFuncMap[path](queries)

				.done(function(result) {
					_respondResult(response, result);
				}, 

				function(err) {
					console.log(err);
					_respondResult(response, null);
				});
			}
		});
	};

	var _listen = function() {
		var port = 8080;
		_server.listen(port, function() {
			console.log("Start Server Listen");
		});
	}

	var startServer = function() {
		_loadRouteModules();
		_createServer();
		_registerRequestHandler();
		_listen();
		return _server;
	};

	return {'startServer': startServer};

})();

exports.ServerHelper = ServerHelper;
