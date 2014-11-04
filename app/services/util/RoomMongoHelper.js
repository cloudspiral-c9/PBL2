
var MongoUtil = require( __dirname + '/../util/MongoUtil.js');
var TimestampHelper = require( __dirname + '/../util/Timestamphelper.js');
var deferred = require('deferred');


var RoomManager = (function() {

	//指定した部屋を作成する
	//作成に成功した場合はmembers以外のRoomオブジェクトを返す
	var createNewRoom = function(rid, description, title, limit, userId, type) {

		var executeFunc = function(db, deferred) {

			if (!(rid && description && title && limit && userId && type)) {
				deferred.resolve(false);
				return;
			}

			var members = [userId];
			var now = TimestampHelper.getTimestamp();
			var query = {'rid': rid, 'description': description, 'title': title, 'limit': limit, 'members': members, 'timestamp': now, 'type': type};
			db.collection('Room').insert(query, function(err, doc) {

				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				delete query.members;
				deferred.resolve(query);
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};


	//ridで指定した部屋の情報を取得する
	var getRoom = function(rid) {

		var executeFunc = function(db, deferred) {

			var query = {'rid': rid};
			db.collection('Room').findOne(query, function(err, result) {
				
				db.close();

				if (err) {
					console.log(err);
					deferred.resolve(false);
					return;
				}

				delete result._id;
				deferred.resolve(result);
			});

		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};


	var isExist = function(rid) {

		var def = deferred();
		if (!rid) {
			return def.promise;
		}

		getRoom(rid).done(function(result) {
			
			if (!result) {
				def.resolve(false);
				return;
			}

			def.resolve(true);

		}, function(err) {
			def.resolve(false);
		});

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	}


	//ridで指定した部屋を削除する
	var removeRoom = function(rid) {

		var executeFunc = function(db, deferred) {

			var query = {'rid': rid};
			db.collection('Room').remove(query, function(err, result) {

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

	//指定したridの部屋にuserIDのユーザを追加する
	var addMember = function(rid, userID) {

		var executeFunc = function(db, deferred) {

			if ( !(userID && userID) ) {
				db.close();
				deferred.resolve(false);
				return;
			}
			
			getRoom(rid).done(function(room) {
				
				//既にその部屋のメンバの場合はtrueを返して終了
				var members = room.members;
				if (members.indexOf(userID) !== -1) {
					db.close();
					deferred.resolve(true);
					return;	
				}

				//人数がlimitを超える場合は不可
				var limit = room.limit;
				if (limit < members.length + 1) {
					db.close();
					deferred.resolve(false);
					return;
				}

				members.push(userID);
				var updateQuery = {'$set': {'members': members}};
				db.update({'rid': rid}, updateQuery, function(err, count, status) {

					db.close();

					if (err) {
						console.log(err);
						deferred.resolve(false);
						return;
					}

					deferred.resolve(true);
				});

			}, function(err) {
				console.log(err);
				deferred.resolve(false);
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};

	
	var removeMember = function(rid, userID) {

		var executeFunc = function(db, deferred) {

			getRoom(rid).done(function(room) {
				
				//指定した部屋のメンバに入っていなければ終了
				var members = room.members;
				if (members.indexOf(userID) === -1) {
					db.close();
					deferred.resolve(true);
					return;	
				}

				members.splice(members.indexOf(userID), 1);
				var updateQuery = {'$set': {'members': members}};
				db.update({'rid': rid}, updateQuery, function(err, count, status) {

					db.close();

					if (err) {
						console.log(err);
						deferred.resolve(false);
						return;
					}

					deferred.resolve(true);
				});

			}, function(err) {
				console.log(err);
				deferred.resolve(false);
			});
		};

		var promise = MongoUtil.executeMongoUseFunc(executeFunc);
		return promise;
	};


	return {'createNewRoom': createNewRoom, 'getRoom': getRoom, 'isExist': isExist, 'removeRoom': removeRoom, 'addMember': addMember, 'removeMember': removeMember};

})();

exports.RoomManager = RoomManager;
