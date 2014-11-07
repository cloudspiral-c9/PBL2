
var NutritionMongoHelper = require( __dirname + '/../services/chart/NutritionMongoHelper.js').NutritionMongoHelper;
var IngredientMongoHelper = require( __dirname + '/../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var MongoTestHelper = require( __dirname + '/MongoTestHelper.js').MongoTestHelper;
var assert = require('assert');

var idealNutrition = { "energy" : 850, "protein" : 25, "lipid" : 25, "carbohydrate" : 100, "calcium" : 220, "iron" : 2.5, "vitaminE" : 3, "vitaminB1" : 0.35, "vitaminB2" : 0.52, "vitaminC" : 33, "cholesterol" : 200, "solt" : 3 };
var user = {'userID': '117100601559522934217', 'userName': '水野聖也'};
var getIdealNutritionTest = function() {

	NutritionMongoHelper.getIdealNutrition()
	.done(function(result) {
		console.log('ideal');
		console.log(result);
		assert.deepEqual(result, idealNutrition)
	}, function(err) {});
};
getIdealNutritionTest();



var ingredientData = {'ingredient': 'フランスパン', 'amount':1, 'sender': 'mizuno' };
var expected1 = {"name" : "フランスパン", "energy" : 2.79, "protein" : 0.094, "lipid" : 0.013, "carbohydrate" : 0.575, "calcium" : 0.16, "iron" : 0.009, "vitaminE" : 0.001, "vitaminB1" : 0.0008, "vitaminB2" : 0.0005, "vitaminC" : 0, "cholesterol" : 0, "solt" : 0.016 };
var getNutritionTest = function() {

	NutritionMongoHelper.getNutrition(ingredientData)
	.done(function(actual) {
		console.log('getNutrition');
		console.log(actual);
		assert.deepEqual(actual, expected1);

	}, function(err) {});
};
getNutritionTest();

var ingredientData2 = {'ingredient': 'ごはん', 'amount': 1, 'sender': user.userID};
var expected2 = { "name" : "ごはん", "energy" : 1.68, "protein" : 0.025, "lipid" : 0.003, "carbohydrate" : 0.371, "calcium" : 0.03, "iron" : 0.001, "vitaminE" : 0, "vitaminB1" : 0.0002, "vitaminB2" : 0.0001, "vitaminC" : 0, "cholesterol" : 0, "solt" : 0 };
var ingredientDatas = [ingredientData, ingredientData2];
var expectedDatas = [expected1, expected2];
var getNutritionsByRidTest = function() {

	MongoTestHelper.clearCollection('Ingredient').done(function(res) {

		IngredientMongoHelper.insertIngredient(1, ingredientData.ingredient, ingredientData.amount, ingredientData.sender)
		.done(function(res2) {

			IngredientMongoHelper.insertIngredient(1, ingredientData2.ingredient, ingredientData2.amount, ingredientData2.sender)
			.done(function(res3) {


				NutritionMongoHelper.getNutritionsByRid(1)
				.done(function(actual) {
					console.log('getbyrid');
					console.log(actual);
					console.log(expectedDatas);
					assert.deepEqual(actual, expectedDatas);
				});

			}, function(err) {})

		}, function(err) {})

	}, function(err) {})

};
getNutritionsByRidTest();
