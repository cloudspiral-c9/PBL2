
var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var deferred = require('deferred');
var async = require('async');
var LoginMongoHelper = require(__dirname + '/../login/LoginMongoHelper.js').LoginMongoHelper;

var RecipeProcessMongoHelper = (function() {

	var insertRecipeProcess = function(rid, process, userID, index, now) {

		var executeFunc = function(db, deferred) {

			if (!(rid && process && userID)) {
				db.close();
				deferred.resolve(false);
				return;
			}

			var query = {'rid': rid, 'process': process, 'userID': userID, 'timestamp': now};
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

				deferred.resolve(doc[0]._id);
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
			
			cursor.toArray(function(err, processes) {

				db.close();

				if (err) {	
					console.log(err);
					deferred.resolve(false);
					return;
				}

				var result = new Array();
				async.each(processes, function(process, callback) {

					LoginMongoHelper.getUserNameById(process.userID)
					.done(function(userName) {
						delete process.rid;
						delete process.userID;
						process.userName = userName;
						result.push(process);
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

	var removeRecipeProcessBy_id = function(_id) {

		var executeFunc = function(db, deferred) {

			if (!_id) {
				return;
			}

			var query = {'_id': _id};
			db.collection('Process').remove(query, function(err, result) {

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

	var updateRecipeProcessBy_id = function(_id, process, userID, index, now) {

		var executeFunc = function(db, deferred) {

			if (!_id) {
				deferred.resolve(false);
				return;
			}

			var query  = {'_id': _id};
			var setQuery = {'process': process, 'userID': userID, 'timestamp': now};
			if (index) {
				setQuery.index = index;
			}
			var updateQuery = {'$set': setQuery};
			db.collection('Process').update(query, updateQuery, function(err, count, status) {

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

	return {'insertRecipeProcess': insertRecipeProcess, 'getRecipeProcesses': getRecipeProcesses,  'removeRecipeProcessBy_id': removeRecipeProcessBy_id, 'updateRecipeProcessBy_id': updateRecipeProcessBy_id};

})();

exports.RecipeProcessMongoHelper = RecipeProcessMongoHelper;