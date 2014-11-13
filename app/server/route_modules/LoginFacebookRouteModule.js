'use strict';

var passport = require(__dirname + '/../../services/login/passport.js').passport;

var LoginFacebookRouteModule = {

  route: '/auth/facebook',
  request: null,
  response: null,
  next: null,
  routeFunc: function(queries) {
    console.log(this.route);
    passport.authenticate('facebook')(this.request, this.response, this.next);
    console.log('authenticate-facebook');
  }
};

exports.LoginFacebookRouteModule = LoginFacebookRouteModule;
