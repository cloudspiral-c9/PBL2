'use strict';

var http = require('http');
var url = require('url');
var fs = require('fs');
var deferred = require('deferred');
var uuid = require('node-uuid');

var express = require('express');
var session = require('express-session');
var methodoverride = require('method-override');
var MongoStore = require('connect-mongo')(session);
var app = express();
var passport = require(__dirname + '/../services/login/passport.js').passport;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var viewRouter = require(__dirname + '/view_route_modules/index.js');


//SessionのためのMongoConnectの設定
var sessionStore = new MongoStore({
  db: 'recipeers',
  collection: 'sessions',
  host: '127.0.0.1',
  port: 27017,
  username: 'mizuno',
  password: 'saintseiya'
}, function() {
  console.log('session store established');
});

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: uuid.v4(),
  store: sessionStore,
  cookie: {
    httpOnly: false,
    maxAge: new Date(Date.now() + 60 * 60 * 1000)
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(viewRouter);
app.use(express.static('public'));
app.set('views', '/home/ec2-user/recipeers/public/');
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);



var ServerHelper = (function() {

  var _server = null;

  var _respondResult = function(response, result) {

    //レスポンスヘッダを記述
    var statusCode = (!result && result !== null) ? 500 : 200;

    var headers = {
      'Content-Type': 'application/json charset=UTF-8\n'
    };
    response.writeHead(statusCode, headers);

    //レスポンスボディを記述
    var encode = 'UTF-8';
    console.log('result', result);
    if(!result) result = [];
    response.write(JSON.stringify(result), encode);

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
      } else {
        promise.done(function(result) {
          _respondResult(response, result);
        }, function(err) {
          console.log(err);
          _respondResult(response, err);
        });
      }
    });

    app.post(route, function(request, response, next) {

      module.request = request;
      module.response = response;
      module.next = next;

      var promise = module.routeFunc(request.body);

      if (!promise) {
        return;
      } else {
        promise.done(function(result) {
          _respondResult(response, result);
        }, function(err) {
          console.log(err);
          _respondResult(response, err);
        });
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
  };

  var startServer = function() {
    _loadRouteModules();
    _createServer();
    _listen();
    return _server;
  };

  return {
    'startServer': startServer
  };

})();

exports.ServerHelper = ServerHelper;
