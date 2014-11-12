'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LoginMongoHelper = require( __dirname + '/LoginMongoHelper.js' ).LoginMongoHelper;

var GOOGLE_CLIENT_ID = '912049202501-j8bjuf1jsnq8uefo5qecbhigj5erppm5.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'mUlINrSun4TKrqpbhW3arpoF';
var CALLBACK_URL = 'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/google/callback';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var strategy = new GoogleStrategy(

{
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: CALLBACK_URL
},

function(accessToken, refreshToken, profile, done) {

	console.log(profile);

	LoginMongoHelper.insertLoginUserId(profile.id, profile.displayName)
	.done(function(result) {

		if (result) {
			done(null, {'userID': profile.id, 'userName': profile.displayName});
		} else {
			done(null, false);
		}

	}, function(err) {
		console.log(err);
		done(err, null);
	});
});
passport.use(strategy);

exports.passport = passport;
