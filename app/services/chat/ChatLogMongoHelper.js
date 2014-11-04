
var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var deferred = require('deferred');


var ChatLogMongoHelper = (function() {

	var insertMessage = function(rid, message, sender, now) {
		
		var executeFunc = function(db, deferred) {
			
			if (!(rid && message && sender && now)) {
				db.close();
				deferred.resolve(false);
			}

			var query = {'rid': rid, 'sender': sender, 'message': message, 'timestamp': now};
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
					return;
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

	return {'insertMessage': insertMessage, 'getChatLog': getChatLog};

})();


exports.ChatLogMongoHelper = ChatLogMongoHelper;