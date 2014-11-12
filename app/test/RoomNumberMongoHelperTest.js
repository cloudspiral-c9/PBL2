'use strict';

var RoomNumberMongoHelper = require( __dirname + '/../services/login/RoomNumberMongoHelper.js').RoomNumberMongoHelper;
var assert = require('assert');
var deferred = require('deferred');
var MongoTestHelper = require(__dirname + '/MongoTestHelper.js').MongoTestHelper;

(function() {

	MongoTestHelper.clearCollection('RoomNumber')
	.done(function(result) {

		RoomNumberMongoHelper.getCurrentRid()
		.done(function(rid) {

			console.log('first rid');
			console.log(rid);
			assert.strictEqual(rid, 1);

			RoomNumberMongoHelper.upsertCurrentRid(3)
			.done(function(result) {

				RoomNumberMongoHelper.getCurrentRid()
				.done(function(rid2) {

					var expected = 3;

					console.log('after upsert');
					console.log(rid2);

					assert.strictEqual(rid2, expected);

				}, function(err) {});

			}, function(err) {});

		}, function(err) {});

	}, function(err) {});
})();


