'use strict';

var passport = require(__dirname + '/../../services/login/passport.js').passport;
var deferred = require('deferred');

var LoggedInRouteModule = {

  route: '/auth/google/callback',
  request: null,
  response: null,
  next: null,
  routeFunc: function(queries) {

    var def = deferred();


    var that = this;
    passport.authenticate('google', function(err, userObj) {

      if (err) {
        console.log(err);
        def.resolve(false);
        return;
      }


      that.request.logIn(userObj, function(err) {
        if (err) {
          console.log(err);
        }
      });

      that.response.cookie('user', JSON.stringify(userObj), {
        domain: 'ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com',
        path: '/',
        expires: new Date(Date.now() + 30 * 60 * 1000)
      });
      that.response.redirect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/roomselect/login');
    })(that.request, that.response, that.next);

    return def.promise;

  }
};

exports.LoggedInRouteModule = LoggedInRouteModule;
