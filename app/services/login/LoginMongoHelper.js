'use strict';

var MongoUtil = require( __dirname + '/../util/MongoUtil.js');

var LoginMongoHelper = (function() {


	var isLoggedIn = function(userID) {

		var executeFunc = function(db, deferred) {

			if (!userID) {
				db.close();
				return;
			}

			var query = {'userID': userID};
			db.collection('login').findOne(query, function(err, doc) {

				db.close();

				if (doc) {
					deferred.resolve(true);
					return;
				}

				console.log('user: ' + userID + ' is not logged-in');
				deferred.resolve(false);

			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};


	var insertLoginUserId = function(userID, userName) {

		var executeFunc = function(db, deferred) {

			if (!userID) {
				db.close();
				return;
			}

			var query = {'userID': userID, 'userName': userName};
			var update = {'$setOnInsert': {'userID': userID, 'userName': userName}};
			db.collection('login').findAndModify( query , [['userID', 1]], update, {'new': true, 'upsert': true}, function(err, result) {

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

	var removeLoginUserId = function(userID) {

		var executeFunc = function(db, deferred) {

			if (!userID) {
				db.close();
				return;
			}

			var query = {'userID': userID};
			db.collection('login').remove(query, function(err, result) {

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


	var getUserNameById = function(userID) {

		var executeFunc = function(db, deferred) {

			if (!userID) {
				db.close();
				deferred.resolve(false);
				return;
			}

			var query = {'userID': userID};
			db.collection('login').findOne(query, function(err, userObj) {

				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				if (!userObj) {
					deferred.resolve(null);
					return;
				}

				deferred.resolve(userObj.userName);
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};

	



	return {'insertLoginUserId': insertLoginUserId, 'removeLoginUserId': removeLoginUserId, 'isLoggedIn': isLoggedIn, 'getUserNameById': getUserNameById};

})();


exports.LoginMongoHelper = LoginMongoHelper;
