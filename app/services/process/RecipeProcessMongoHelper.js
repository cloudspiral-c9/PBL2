
var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var deferred = require('deferred');

var RecipeProcessMongoHelper = (function() {

	var insertRecipeProcess = function(rid, process, sender, index, now) {

		var executeFunc = function(db, deferred) {

			if (!(rid && process && sender)) {
				db.close();
				deferred.resolve(false);
				return;
			}

			var query = {'rid': rid, 'process': process, 'sender': sender, 'timestamp': now};
			if (index) {
				query.index = index;
			}
			db.collection('Process').insert(query, function(err, doc) {

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


	var getRecipeProcesses = function(rid) {

		var executeFunc = function(db, deferred) {

			if (!rid) {
				db.close();
				deferred.resolve(false);
				return;
			}

			var query = {'rid': rid};
			var cursor = db.collection('Process').find(query, {'sort': [['timestamp', 'desc']]});
			
			var result = new Array();
			cursor.each(function(err, doc) {

				if (err) {
					db.close();
					console.log(err);
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

	return {'insertRecipeProcess': insertRecipeProcess, 'getRecipeProcesses': getRecipeProcesses};

})();

exports.RecipeProcessMongoHelper = RecipeProcessMongoHelper;