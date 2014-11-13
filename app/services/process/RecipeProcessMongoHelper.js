'use strict';

var MongoUtil = require(__dirname + '/../util/MongoUtil.js');
var utils = require(__dirname + '/../util/util.js');

var RecipeProcessMongoHelper = (function() {

  var insert = function(rid, process, sender, index, now) {
    return utils.gen(utils.insert)('Process', rid, {
      process: process,
      sender: sender,
      timestamp: now
    }, index);
  };

  var add = function(rid, process, sender, now) {
    return utils.gen(utils.add)('Process', rid, {
      process: process,
      sender: sender,
      timestamp: now
    });
  };

  var get = function(rid) {
    return utils.gen(utils.get)('Process', rid, null);
  };

  var removeRecipeProcessBy_id = function(_id) {

    var executeFunc = function(db, deferred) {

      if (!_id) {
        return;
      }

      var query = {
        '_id': _id
      };
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

  var remove = function(rid, index) {
    return utils.gen(utils.remove)('Process', rid, null, index);
  };

  var updateRecipeProcessBy_id = function(_id, process, userID, index, now) {

    var executeFunc = function(db, deferred) {

      if (!_id) {
        deferred.resolve(false);
        return;
      }

      var query = {
        '_id': _id
      };
      var setQuery = {
        'process': process,
        'userID': userID,
        'timestamp': now
      };
      if (index) {
        setQuery.index = index;
      }
      var updateQuery = {
        '$set': setQuery
      };
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

  var edit = function(rid, process, sender, index, now) {
    return utils.gen(utils.edit)('Process', rid, {
      process: process,
      sender: sender,
      timestamp: now
    }, index);
  };

  return {
    'insertRecipeProcess': insert,
    'getRecipeProcesses': get,
    'removeRecipeProcessBy_id': removeRecipeProcessBy_id,
    'updateRecipeProcessBy_id': updateRecipeProcessBy_id,
    insert: insert,
    add: add,
    edit: edit,
    remove: remove,
    get: get
  };

})();

exports.RecipeProcessMongoHelper = RecipeProcessMongoHelper;
