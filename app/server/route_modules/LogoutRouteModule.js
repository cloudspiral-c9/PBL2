
var LoginMongoHelper = require( __dirname + '/../../services/login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');

var LogoutRouteModule = {
	
	route: '/logout',
	request: null,
	response: null,
	routeFunc: function(queries) {
		
		var def = deferred();

		if ( !(this.request.cookies || this.request.session) ) {
			console.log('both cookies and session not found');
			this.response.redirect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/');
		}

		if (!(this.request.cookies.user || this.request.user) ) {
			console.log('both cookies and session s user not found');
			this.response.redirect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/');
		}

		var userId = !this.request.user ? JSON.parse(this.request.cookies.user).userID: this.request.user.userID;
		console.log(userId);

		var that = this;
		LoginMongoHelper.removeLoginUserId(userId)
		.done(function(result) {
			that.request.session.destroy();
			that.request.session = null;
			that.response.clearCookie('user', {domain: 'ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com', path: '/'});
			that.response.clearCookie('connect.sid', {domain: 'ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com', path: '/'} )
			that.response.redirect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/');
			console.log('logout successfully');
			def.resolve(result);
		}, function(err) {
			def.resolve(false);
		});
	}

};

exports.LogoutRouteModule = LogoutRouteModule;
