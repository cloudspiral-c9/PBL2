
var passport = require('passport');
var GoogleStrategy = require('passport-google').strategy;

var baseURL = 'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com';
passport.use(new GoogleStrategy( {
	returnURL: baseURL + '/auth/google/return',
	realm: baseURL + '/public' 
}, 

function(identifier, profile, done) {


} ));

exports.passport = passport;
