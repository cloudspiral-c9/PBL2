'use strict';

var MongoUtil = require(__dirname + '/../util/MongoUtil.js');
var TimestampHelper = require(__dirname + '/../util/TimestampHelper.js');
var RoomNumberMongoHelper = require(__dirname + '/RoomNumberMongoHelper.js').RoomNumberMongoHelper;
var LoginMongoHelper = require(__dirname + '/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');


var RoomManager = (function() {

  //指定した部屋を作成する
  //作成に成功した場合はmembers以外のRoomオブジェクトを返す
  var createNewRoom = function(description, title, limit, userId, userName, type) {

    console.log();
    var executeFunc = function(db, deferred) {

      RoomNumberMongoHelper.getCurrentRid().done(function(rid) {

        if (!(rid && description && title && limit && userId && type)) {
          console.log('roomget false');
          deferred.resolve(false);
          return;
        }

        if (!userName) {
          userName = '';
        }

        var members = [{
          'userID': userId,
          'userName': userName
        }];
        var now = TimestampHelper.getTimestamp();
        var query = {
          'rid': rid
        };
        var update = {
          'rid': rid,
          'userID': userId,
          'userName': userName,
          'description': description,
          'title': title,
          'limit': limit,
          'members': members,
          'timestamp': now,
          'type': type
        };

        db.collection('Room').findAndModify(query, [
          ['userID', 1]
        ], update, {
          'new': true,
          'upsert': true
        }, function(err, result) {

          if (err) {
            db.close();
            console.log(err);
            deferred.resolve(false);
            return;
          }

          //DBのridカウントを更新し，成功すればRoomオブジェクトを返す．
          RoomNumberMongoHelper.upsertCurrentRid(rid + 1).done(function(result) {

            db.close();

            if (!result) {
              deferred.resolve(false);
              return;
            }

            delete update.members;
            delete update._id;
            console.log('create', update);
            deferred.resolve(update);

          }, function(err) {
            console.log(err);
            deferred.resolve(false);
          });
        });

      }, function(err) {
        console.log(err);
        deferred.resolve(false);
      });

    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunc);
    return promise;
  };

  var add = function(description, title, limit, userId, userName, type) {

    console.log();
    var executeFunc = function(db, deferred) {


      RoomNumberMongoHelper.getCurrentRid().done(function(rid) {

        if (!(description && title && limit && userId)) {
          console.log('roomget false');
          deferred.resolve(false);
          return;
        }

        rid = new Date().getTime();
        type = type || 'hyperEnjoy';

        if (!userName) {
          userName = '';
        }

        var members = [{
          'userID': userId,
          'userName': userName
        }];
        var now = TimestampHelper.getTimestamp();
        var update = {
          'rid': rid,
          'userID': userId,
          'userName': userName,
          'description': description,
          'title': title,
          'limit': limit,
          'members': members,
          'timestamp': now,
          'type': type
        };

        db.collection('Room').insert(update, function(err, result) {

          if (err) {
            db.close();
            console.log(err);
            deferred.resolve(false);
            return;
          }

          //DBのridカウントを更新し，成功すればRoomオブジェクトを返す．
          RoomNumberMongoHelper.upsertCurrentRid(rid + 1).done(function(result) {

            db.close();

            if (!result) {
              console.log('ridnothing');
              deferred.resolve(false);
              return;
            }

            delete update._id;
            console.log('create', update);
            deferred.resolve(update);

          }, function(err) {
            console.log(err);
            deferred.resolve(false);
          });
        });

      }, function(err) {
        console.log(err);
        deferred.resolve(false);
      });

    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunc);
    return promise;
  };


  //ridで指定した部屋の情報を取得する
  var getRoom = function(rid) {

    var executeFunc = function(db, deferred) {

      var query = {
        'rid': rid
      };
      db.collection('Room').findOne(query, function(err, result) {

        db.close();

        if (err) {
          console.log(err);
          deferred.resolve(false);
          return;
        }

        if (!result) {
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

    return def.promise;
  };


  //ridで指定した部屋を削除する
  var removeRoom = function(rid) {

    var executeFunc = function(db, deferred) {

      var query = {
        'rid': rid
      };
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

  var _getUserIndexInMembers = function(userID, members) {

    var index = -1;
    for (var i = 0; i < members.length; i++) {

      if (members[i].userID === userID) {
        index = i;
        break;
      }
    }

    return index;
  };

  //指定したridの部屋にuserIDのユーザを追加する
  var addMember = function(rid, userID, userName) {

    var executeFunc = function(db, deferred) {

      if (!(rid && userID)) {
        db.close();
        deferred.resolve(false);
        return;
      }

      if (!userName) {
        userName = '';
      }

      var user = {
        'userID': userID,
        'userName': userName
      };

      //ログイン済みのユーザかチェック
      LoginMongoHelper.isLoggedIn(userID).done(function(result) {

        if (!result) {
          db.close();
          deferred.resolve(false);
          return;
        }

        getRoom(rid).done(function(room) {

          //指定された部屋がない場合はfalseを返して終了
          if (!room) {
            db.close();
            deferred.resolve(false);
            console.log('room ' + rid + ' not found');
            return;
          }

          //既にその部屋のメンバの場合はtrueを返して終了
          var members = room.members;
          if (_getUserIndexInMembers(userID, members) !== -1) {
            db.close();
            deferred.resolve(true);
            console.log('already room member');
            return;
          }

          //人数がlimitを超える場合は不可
          members.push(user);
          var limit = room.limit;
          if (limit < members.length) {
            db.close();
            deferred.resolve(false);
            console.log('limit over');
            return;
          }

          //DBの更新
          var updateQuery = {
            '$set': {
              'members': members
            }
          };
          db.collection('Room').update({
            'rid': rid
          }, updateQuery, function(err, count, status) {

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
        var index = _getUserIndexInMembers(userID, members);
        if (index === -1) {
          db.close();
          deferred.resolve(true);
          return;
        }

        //membersを減らす
        members.splice(index, 1);
        var updateQuery = {
          '$set': {
            'members': members
          }
        };
        db.collection('Room').update({
          'rid': rid
        }, updateQuery, function(err, count, status) {

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

  //userIDのユーザが指定したridのメンバかチェック
  var isMemberOf = function(rid, userID) {

    var def = deferred();
    if (!(rid && userID)) {
      def.resolve(false);
      return def.promise;
    }

    getRoom(rid).done(function(room) {

      if (!room) {
        def.resolve(false);
        return;
      }

      var members = room.members;
      var isMember = _getUserIndexInMembers(userID, members) !== -1;

      def.resolve(isMember);

    }, function(err) {
      console.log(err);
      def.resolve(false);
    });

    return def.promise;
  };

  var getRoomListByType = function(type) {

    var executeFunc = function(db, deferred) {

      if (type !== 'gachi' && type !== 'enjoy' && type !== 'hyperEnjoy' && type !== 'all') {
        db.close();
        deferred.resolve(false);
        return;
      }


      var query = ((type === 'all') ? {
        'type': type
      } : null);
      var cursor = db.collection('Room').find(query);

      var result = [];
      cursor.each(function(err, doc) {

        if (err) {
          console.log(err);
          return;
        }

        if (!doc) {
          deferred.resolve(result);
        } else {
          delete doc._id;
          result.push(doc);
        }
      });
    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunc);
    return promise;
  };

  var get = function() {

    var executeFunc = function(db, deferred) {

      var cursor = db.collection('Room').find();

      var result = [];
      cursor.each(function(err, doc) {

        if (err) {
          console.log(err);
          return;
        }

        if (!doc) {
          deferred.resolve(result);
        } else {
          delete doc._id;
          result.push(doc);
        }
      });
    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunc);
    return promise;
  };


  return {
    'createNewRoom': createNewRoom,
    'getRoom': getRoom,
    'isExist': isExist,
    'removeRoom': removeRoom,
    'addMember': addMember,
    'removeMember': removeMember,
    'isMemberOf': isMemberOf,
    'getRoomListByType': getRoomListByType,
    get: get,
    add: add
  };

})();

exports.RoomManager = RoomManager;
