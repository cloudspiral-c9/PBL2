
var assert = require('assert');
var RecipeProcessMongoHelper = require( __dirname + '/../services/process/RecipeProcessMongoHelper.js').RecipeProcessMongoHelper;
var TimestampHelper = require( __dirname + '/../services/util/TimestampHelper.js');
var MongoTestHelper = require( __dirname + '/MongoTestHelper.js').MongoTestHelper;

var rid = 3;
var process1 = '卵を入れる';
var process2 = 'かきまぜる';
var sender = 'mizuno';
var processSequence1 = 2;
var processSequence2 = 3;
var now = TimestampHelper.getTimestamp();

var expected = [{'process': process1, 'sender': sender, 'timestamp': now, 'index': processSequence1}, {'process': process2, 'sender': sender, 'timestamp': now, 'index': processSequence2}];
var getRecipeProcessesTest = function() {

	MongoTestHelper.clearCollection('Process')
	.done(function(result) {

		RecipeProcessMongoHelper.insertRecipeProcess(rid, process1, sender, processSequence1, now)
		.done(function(result) {

			RecipeProcessMongoHelper.insertRecipeProcess(rid, process2, sender, processSequence2, now)
			.done(function(result2) {

				RecipeProcessMongoHelper.getRecipeProcesses(rid)
				.done(function(actual) {

					console.log(actual);
					assert.deepEqual(actual, expected);

				});

			}, function(err) { });

		}, function(err) {});
	}, 
	function(err) {});
};

getRecipeProcessesTest();