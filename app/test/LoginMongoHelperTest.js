
var LoginMongoHelper = require(__dirname + '/../services/login/LoginMongoHelper.js').LoginMongoHelper;
var assert = require('assert');
var MongoTestHelper = require(__dirname + '/MongoTestHelper.js').MongoTestHelper;

var expected = {'userID': '117100601559522934217', 'userName': '水野聖也'};


var otherTest = function() {

	console.log('othertest');

	MongoTestHelper.clearCollection('login')
	.done(function(result) {

		LoginMongoHelper.insertLoginUserId(expected.userID, expected.userName)
		.done(function(result) {

			LoginMongoHelper.isLoggedIn(expected.userID)
			.done(function(isLoggedIn) {

				assert.strictEqual(isLoggedIn, true);
				
				LoginMongoHelper.isLoggedIn('houhou')
				.done(function(isLoggedIn2) {

					assert.strictEqual(isLoggedIn2, false);

					LoginMongoHelper.getUserNameById(expected.userID)
					.done(function(userName) {

						console.log(userName);
						assert.strictEqual(userName, expected.userName);

						LoginMongoHelper.removeLoginUserId(expected.userID)
						.done(function(result) {

							LoginMongoHelper.isLoggedIn(expected.userID)
							.done(function(isLoggedIn3) {

								assert.strictEqual(isLoggedIn3, false);

							}, function(err) {})

						}, function(err) {})

					}, function(err) {})

				}, function(err) {})

			}, function(err) {})

		}, function(err) {})

	}, function(err) {})
};

otherTest();

