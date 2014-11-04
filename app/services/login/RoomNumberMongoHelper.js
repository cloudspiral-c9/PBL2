
var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var deferred = require('deferred');

var RoomNumberMongoHelper = (function() {

	//指定したridを現在のridとしてDBに格納する
	var upsertCurrentRid = function(rid) {

		var executeFunc = function(db, deferred) {

			var query = {'rid': {'$exists': true} };
			var updateQuery = {'$set': {'rid': rid}};
			db.collection('RoomNumber').update(query, updateQuery, {'upsert': true}, function(err, count, status) {
				
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

	var getCurrentRid = function() {

		var executeFunc = function(db, deferred) {

			var query = {'rid': {'$exists': true} };
			db.collection('RoomNumber').findOne(query, function(err, doc) {

				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
				}

				if (doc) {
					
					deferred.resolve(doc.rid);
				
				} else {

					//DBになかった場合はridを1として新たに作成
					//rid = 1として結果を返す
					upsertCurrentRid(1).done(function(result) {
						
						if (!result) {
							deferred.resolve(false);
							return;
						}

						deferred.resolve(1);
						return;

					}, function(err) {
						deferred.resolve(false);
						return;
					});

				}
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};
	

	return {'upsertCurrentRid': upsertCurrentRid, 'getCurrentRid': getCurrentRid};

})();
	
exports.RoomNumberMongoHelper = RoomNumberMongoHelper;
