
var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var deferred = require('deferred');

var LoginMongoHelper = (function() {
	
	var insertLoginUserId = function(userID) {

		var executeFunc = function(db, deferred) {
			
			if (!userID) {
				db.close();
				return;
			}

			var query = {'userID': userID};
			db.collection('login').insert(query, function(err, result) {

				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
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
				}

				deferred.resolve(true);

			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};

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


	return {'insertLoginUserId': insertLoginUserId, 'removeLoginUserId': removeLoginUserId, 'isLoggedIn': isLoggedIn};

})();


exports.LoginMongoHelper = LoginMongoHelper;
