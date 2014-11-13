'use strict';

var MongoUtil = require(__dirname + '/../util/MongoUtil.js');
var utils = require(__dirname + '/../util/util.js');

var LoginMongoHelper = require(__dirname + '/../login/LoginMongoHelper.js').LoginMongoHelper;
var async = require('async');

var ChatLogMongoHelper = (function() {

  var add = function(rid, message, sender, now) {
    return utils.gen(utils.add)('ChatLog', rid, {
      message: message,
      sender: sender,
      timestamp: now
    });
  };

  var get = function(rid, pos, limit) {
    return utils.gen(utils.genGetOpt({
      pos: pos,
      limit: limit,
      sort: function(a, b) {
        return (new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1);
      }
    }))('ChatLog', rid, null);
  };

  var removeMessageBy_id = function(_id) {

    var executeFunc = function(db, deferred) {

      if (!_id) {
        return;
      }

      var query = {
        '_id': _id
      };
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

  return {
    'insertMessage': add,
    'getChatLog': get,
    'removeMessageBy_id': removeMessageBy_id,
    get: get,
    add: add
  };

})();


exports.ChatLogMongoHelper = ChatLogMongoHelper;
