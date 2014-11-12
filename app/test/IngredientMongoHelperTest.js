'use strict';

var IngredientMongoHelper = require(__dirname + '/../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var LoginMongoHelper = require(__dirname + '/../services/login/LoginMongoHelper.js').LoginMongoHelper;
var MongoTestHelper = require(__dirname + '/MongoTestHelper.js').MongoTestHelper;
var assert = require('assert');

var user = {'userID': '117100601559522934217', 'userName': '水野聖也'};
var rid = 1;
var ingredientData1 = {'ingredient': 'フランスパン', 'amount': 1, 'userID': user.userID};
var ingredientData2 = {'ingredient': 'ごはん', 'amount': 1, 'userID': user.userID};

var ingredientTest = function() {
	
	MongoTestHelper.clearCollection('Ingredient')
	.done(function(result) {

		IngredientMongoHelper.insertIngredient(rid, ingredientData1.ingredient, ingredientData1.amount, ingredientData1.userID)
		.done(function(_id1) {
			
			console.log(_id1);

			IngredientMongoHelper.insertIngredient(rid, ingredientData2.ingredient, ingredientData2.amount, ingredientData2.userID)
			.done(function(_id2) {

				console.log(_id2);
				IngredientMongoHelper.getIngredients(rid)
				.done(function(ingredientDatas1) {

					console.log(ingredientDatas1);

					var exIng1 = ingredientData1;
					delete exIng1.userID;
					exIng1.userName = user.userName;

					var exIng2 = ingredientData2;
					delete exIng2.userID;
					exIng2.userName = user.userName;
					
					var expected = [exIng2, exIng1];

					delete ingredientDatas1[0]._id;
					delete ingredientDatas1[1]._id;

					assert.deepEqual(ingredientDatas1, expected);

					IngredientMongoHelper.removeIngredientBy_id(_id1)
					.done(function(result) {

						IngredientMongoHelper.getIngredients(rid)
						.done(function(ingredientDatas2) {

							console.log(ingredientDatas2);
							var expected2 = [expected[0]];
							delete ingredientDatas2[0]._id;

							assert.deepEqual(ingredientDatas2, expected2);

							IngredientMongoHelper.updateIngredientBy_id(_id2, 'うに', ingredientData2.amount, user.userID)
							.done(function(result) {

								IngredientMongoHelper.getIngredients(rid)
								.done(function(ingredientDatas3) {

									console.log(ingredientDatas3);

									ingredientData2.ingredient = 'うに';
									delete ingredientData2.userID;
									ingredientData2.userName = user.userName;
									var expected3 = [ingredientData2];

									delete ingredientDatas3[0]._id;
									assert.deepEqual(ingredientDatas3, expected3);

								}, function(err) {});

							}, function(err) {});

						}, function(err) {});

					}, function(err) {});
				});

			}, function(err) {});

		}, function(err){});

	}, function(err) {});
};

ingredientTest();
