

var RecipeProcessMongoHelper = require(__dirname + '/../services/process/RecipeProcessMongoHelper.js').RecipeProcessMongoHelper;
var LoginMongoHelper = require(__dirname + '/../services/login/LoginMongoHelper.js').LoginMongoHelper;
var MongoTestHelper = require(__dirname + '/MongoTestHelper.js').MongoTestHelper;
var assert = require('assert');
var TimestampHelper = require(__dirname + '/../services/util/TimestampHelper.js');

var now = TimestampHelper.getTimestamp();
var user = {'userID': '117100601559522934217', 'userName': '水野聖也'};
var rid = 1;
var processData1 = {'process': '卵を割る', 'userID': user.userID, 'timestamp': now, 'index': 1};
var processData2 = {'process': '卵をまぜる', 'userID': user.userID, 'timestamp': now, 'index': 2};

var processTest = function() {
	
	MongoTestHelper.clearCollection('Process')
	.done(function(result) {

		RecipeProcessMongoHelper.insertRecipeProcess(rid, processData1.process, processData1.userID, processData1.index, processData1.timestamp)
		.done(function(_id1) {
			
			console.log(_id1);

			RecipeProcessMongoHelper.insertRecipeProcess(rid, processData2.process, processData2.userID, processData2.index, processData2.timestamp)
			.done(function(_id2) {

				console.log(_id2);
				RecipeProcessMongoHelper.getRecipeProcesses(rid)
				.done(function(processDatas1) {

					console.log(processDatas1);

					var exProc1 = processData1;
					delete exProc1.userID;
					exProc1.userName = user.userName;

					var exProc2 = processData2;
					delete exProc2.userID;
					exProc2.userName = user.userName;
					
					var expected = [exProc2, exProc1];

					delete processDatas1[0]._id;
					delete processDatas1[1]._id;

					assert.deepEqual(processDatas1, expected);

					RecipeProcessMongoHelper.removeRecipeProcessBy_id(_id1)
					.done(function(result) {

						RecipeProcessMongoHelper.getRecipeProcesses(rid)
						.done(function(processDatas2) {

							console.log(processDatas2);
							var expected2 = [expected[0]];
							delete processDatas2[0]._id;

							assert.deepEqual(processDatas2, expected2);

							RecipeProcessMongoHelper.updateRecipeProcessBy_id(_id2, '卵を焼く', user.userID, 5, now)
							.done(function(result) {

								RecipeProcessMongoHelper.getRecipeProcesses(rid)
								.done(function(processDatas3) {

									console.log(processDatas3);

									var cpPrD2 = processData2;
									cpPrD2.process = '卵を焼く';
									delete cpPrD2.userID;
									cpPrD2.userName = user.userName;
									cpPrD2.index = 5;
									var expected3 = [cpPrD2];

									delete  processDatas3[0]._id;
									assert.deepEqual(processDatas3, expected3);

								}, function(err) {})

							}, function(err) {});

						}, function(err) {});

					}, function(err) {});
				})

			}, function(err) {})

		}, function(err){});

	}, function(err) {})
};

processTest();
