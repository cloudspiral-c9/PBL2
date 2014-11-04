

var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var deferred = require('deferred');

var IngredientMongoHelper = (function(){
	
	var insertIngredient = function(rid, ingredient, amount, sender) {

		var executeFunc = function(db, deferred) {

			if (!(rid && ingredient && amount && sender)) {
				db.close();
				deferred.resolve(false);
			}

			var query = {'rid': rid, 'ingredient': ingredient, 'amount': amount, 'sender': sender};
			db.collection('Ingredient').insert(query, function(err, doc) {

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


	var getIngredients = function(rid) {

		var executeFunc = function(db, deferred) {

			if (!rid) {
				db.close();
				deferred.resolve(false);
				return;
			}

			var query = {'rid': rid};
			var cursor = db.collection('Ingredient').find(query);

			var result = new Array();
			cursor.each(function(err, doc) {
				
				if (err) {
					console.log(err);
					db.close();
					deferred.resolve(false);
					return;
				}

				if (!doc) {
					db.close();
					deferred.resolve(result);
				} else {
					delete doc._id;
					delete doc.rid;
					result.push(doc);
				}
				
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};
	
	return {'insertIngredient': insertIngredient, 'getIngredients': getIngredients};

})();

exports.IngredientMongoHelper = IngredientMongoHelper;