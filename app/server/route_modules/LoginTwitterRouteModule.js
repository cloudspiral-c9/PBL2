'use strict';

var passport = require(__dirname + '/../../services/login/passport.js').passport;

var LoginTwitterRouteModule = {

  route: '/auth/twitter',
  request: null,
  response: null,
  next: null,
  routeFunc: function(queries) {
    console.log(this.route);
    passport.authenticate('twitter')(this.request, this.response, this.next);
    console.log('authenticate-twitter');
  }
};

exports.LoginTwitterRouteModule = LoginTwitterRouteModule;
