'use strict';

var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var LoginMongoHelper = require( __dirname + '/../login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');
var async = require('async');


var ChatLogMongoHelper = (function() {

	var insertMessage = function(rid, message, userID, now) {
		
		var executeFunc = function(db, deferred) {
			
			if (!(rid && message && userID && now)) {
				db.close();
				deferred.resolve(false);
			}

			var query = {'rid': rid, 'userID': userID, 'message': message, 'timestamp': now};
			db.collection('ChatLog').insert(query, function(err, doc) {
				
				db.close();

				if (err) {
					deferred.resolve(false);
					return;
				}

				deferred.resolve(true);
			});

		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};


	var getChatLog = function(rid, pos, limit) {

		var executeFunc = function(db, deferred) {

			if (!rid) {
				db.close();
				deferred.resolve(false);
			}

			var query = {'rid': rid};
			var cursor = db.collection('ChatLog').find(query, {'sort': [ ['timestamp', 'desc'] ] });
			
			if (pos) {
				cursor.skip(pos);
			}

			if (limit) {
				cursor.limit(limit);
			}

			cursor.toArray(function(err, chatlog) {
				
				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				var result = [];
				async.each(chatlog, function(chat, callback) {

					LoginMongoHelper.getUserNameById(chat.userID)
					.done(function(userName) {
						delete chat.rid;
						delete chat.userID;
						chat.userName = userName;
						result.push(chat);
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

	var removeMessageBy_id = function(_id) {
		
		var executeFunc = function(db, deferred) {

			if (!_id) {
				return;
			}

			var query  = {'_id': _id};
			db.collection('ChatLog').remove(query, function(err, result) {
				
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

	return {'insertMessage': insertMessage, 'getChatLog': getChatLog, 'removeMessageBy_id': removeMessageBy_id};

})();


exports.ChatLogMongoHelper = ChatLogMongoHelper;