'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var LoginMongoHelper = require(__dirname + '/LoginMongoHelper.js').LoginMongoHelper;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


//GoogleStrategy
var gStrategy = new GoogleStrategy({
  clientID: '912049202501-j8bjuf1jsnq8uefo5qecbhigj5erppm5.apps.googleusercontent.com',
  clientSecret: 'mUlINrSun4TKrqpbhW3arpoF',
  callbackURL: 'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/google/callback',
  passReqToCallback: true
}, function(request, accessToken, refreshToken, profile, done) {

  LoginMongoHelper.insertLoginUserId(profile.id, profile.displayName)
    .done(function(result) {

      if (result) {
        done(null, {
          'userID': profile.id,
          'userName': profile.displayName
        });
      } else {
        done(null, false);
      }

    }, function(err) {
      console.log(err);
      done(err, null);
    });
});

//FacebookStrategy
var fStrategy = new FacebookStrategy({
  clientID: '872737462758132',
  clientSecret: '8dadf69c34b34e5c2daf2b9447b46341',
  callbackURL: 'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/facebook/callback',
  enableProof: false,
  passReqToCallback: true
}, function(request, accessToken, refreshToken, profile, done) {

  LoginMongoHelper.insertLoginUserId(profile.id, profile.displayName)
    .done(function(result) {

      if (result) {
        done(null, {
          'userID': profile.id,
          'userName': profile.displayName
        });
      } else {
        done(null, false);
      }
    }, function(err) {
      console.log(err);
      done(err, null);
    });
});

//TwitterStrategy
var tStrategy = new TwitterStrategy({
  consumerKey: 'X1F6j3Xe49YdI0LXb0QBUPr6I',
  consumerSecret: 'SV19W4NNp3vDKnpKQoZnyH9EbfM2C7n1McUrSL75kaU1kp5TCR',
  callbackURL: 'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com:8080/auth/twitter/callback',
  passReqToCallback: true
}, function(request, token, tokenSecret, profile, done) {

  console.log(profile);

  LoginMongoHelper.insertLoginUserId(profile.id, profile.displayName)
    .done(function(result) {

      if (result) {
        done(null, {
          'userID': profile.id,
          'userName': profile.displayName
        });
      } else {
        done(null, false);
      }
    }, function(err) {
      console.log(err);
      done(err, null);
    });
});

passport.use(gStrategy);
passport.use(fStrategy);
passport.use(tStrategy);

exports.passport = passport;
