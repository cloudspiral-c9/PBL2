

var assert = require('assert');
var IngredientMongoHelper = require( __dirname + '/../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var MongoTestHelper = require( __dirname + '/MongoTestHelper.js').MongoTestHelper;

var ingredient = 'フランスパン';
var amount = 100;
var rid = 3;
var sender = 'mizuno';
var expected = [{'sender': sender, 'ingredient': 'フランスパン', 'amount': 100}];

var getIngredientTest = function() {

	MongoTestHelper.clearCollection('Ingredient')

	.done(function(result) {

		IngredientMongoHelper.insertIngredient(rid, ingredient, amount, sender)

		.done(function(result2) {

			IngredientMongoHelper.getIngredients(rid)
			.done(function(actual) {
				console.log(actual);
				assert.deepEqual(actual, expected);
			}, 
			function(err) {

			});
		})
	},

	function(err) {});
};

getIngredientTest();


