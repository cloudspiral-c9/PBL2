
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var LoginMongoHelper = require( __dirname + '/LoginMongoHelper.js' );


var baseURL = 'http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com';

var strategy = new GoogleStrategy( {'returnURL': baseURL + '/auth/google/return', 'realm': baseURL + '/recipeers/public'}, 
	
function(identifier, profile, done) {

	LoginMongoHelper.insertLoginUserId(identifier)
	.done(function(result) {
		done(null, {'userID': identifier});
	}, function(err) {
		done(err, null);
	});

});

passport.use(strategy); 
exports.passport = passport;
