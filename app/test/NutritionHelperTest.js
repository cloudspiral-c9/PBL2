
var NutritionHelper = require( __dirname + '/../services/chart/NutritionHelper.js').NutritionHelper;
var MongoTestHelper = require( __dirname + '/MongoTestHelper.js').MongoTestHelper;
var IngredientMongoHelper = require( __dirname + '/../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var assert = require('assert');

var ingredientData = {'ingredient': 'フランスパン', 'amount': 100, 'sender': '117100601559522934217'};
var rid = 1;

MongoTestHelper.clearCollection('Ingredient')
.done(function(result) {

	IngredientMongoHelper.insertIngredient(rid, ingredientData.ingredient, ingredientData.amount, ingredientData.sender)
	.done(function(result) {

		NutritionHelper.getNutritionRates(ingredientData)
		.done(function(nutrition) {

			console.log(nutrition);
			NutritionHelper.getNutritionDatas(rid)
			.done(function(nutritions) {

				console.log(nutritions);
				assert.deepEqual(nutritions[0], nutrition);

			}, function(err) {})

		}, function(err) {});


	}, function(err) {});

}, function(err) {})

