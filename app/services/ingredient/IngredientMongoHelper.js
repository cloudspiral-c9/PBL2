'use strict';

var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var LoginMongoHelper = require( __dirname + '/../login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');
var async = require('async');

var IngredientMongoHelper = (function(){
	
	var insertIngredient = function(rid, ingredient, amount, userID) {

		var executeFunc = function(db, deferred) {

			if (!(rid && ingredient && amount && userID)) {
				db.close();
				deferred.resolve(false);
				return;
			}

			var query = {'rid': rid, 'ingredient': ingredient, 'amount': amount, 'userID': userID};
			db.collection('Ingredient').insert(query, function(err, doc) {

				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				deferred.resolve(doc[0]._id);
			});

		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};


	var getIngredients = function(rid) {

		var executeFunc = function(db, deferred) {

			if (!rid) {
				db.close();
				deferred.resolve(false);
				return;
			}

			var query = {'rid': rid};
			var cursor = db.collection('Ingredient').find(query);

			cursor.toArray(function(err, ingredients) {
				
				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				var result = [];
				async.each(ingredients, function(ingredient, callback) {

					LoginMongoHelper.getUserNameById(ingredient.userID)
					.done(function(userName) {
						delete ingredient.rid;
						delete ingredient.userID;
						ingredient.userName = userName;
						result.push(ingredient);
						callback(null);
					}, function(err) {
						console.log(err);
						callback(err);
					});

				}, function(err) {

					if (err) {
						console.log(err);
						deferred.resolve(false);
						return;
					}
					deferred.resolve(result);
				});

			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};

	var removeIngredientBy_id = function(_id) {

		var executeFunc = function(db, deferred) {

			if (!_id) {
				deferred.resolve(false);
				return;
			}

			var query = {'_id' : _id};
			db.collection('Ingredient').remove(query, function(err, result) {
				
				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				deferred.resolve(result);
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};

	var updateIngredientBy_id = function(_id, ingredient, amount, userID) {

		var executeFunc = function(db, deferred) {
			
			if (!_id) {
				deferred.resolve(false);
				return;
			}

			var query = {'_id': _id};
			var updateQuery = {'$set': {'ingredient': ingredient, 'amount': amount, 'userID': userID}};
			db.collection('Ingredient').update(query, updateQuery, function(err, count, status) {

				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				deferred.resolve(true);
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};



	return {'insertIngredient': insertIngredient, 'getIngredients': getIngredients, 'removeIngredientBy_id': removeIngredientBy_id, 'updateIngredientBy_id': updateIngredientBy_id};

})();

exports.IngredientMongoHelper = IngredientMongoHelper;