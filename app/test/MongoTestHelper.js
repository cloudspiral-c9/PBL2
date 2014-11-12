'use strict';

var MongoClient = require('mongodb').MongoClient;
var deferred = require('deferred');

var MongoTestHelper = {
	
	
	clearCollection: function(collectionName) {
		
		var def = deferred();
		MongoClient.connect('mongodb://localhost/recipeers', function(err, db) {
			var collection = db.collection(collectionName);
			collection.drop(function(err, result) {
				db.close();
				def.resolve(result);
			});
		});
		return def.promise;
	}
	
};

exports.MongoTestHelper = MongoTestHelper;