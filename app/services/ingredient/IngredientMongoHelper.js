'use strict';

var MongoUtil = require(__dirname + '/../util/MongoUtil.js');
var utils = require(__dirname + '/../util/util.js');

var IngredientMongoHelper = (function() {

  var insert = function(rid, ingredient, amount, sender, index) {
    return utils.gen(utils.insert)('Ingredient', rid, {
      ingredient: ingredient,
      amount: amount,
      sender: sender
    }, index);
  };

  var add = function(rid, ingredient, amount, sender) {
    return utils.gen(utils.add)('Ingredient', rid, {
      ingredient: ingredient,
      amount: amount,
      sender: sender
    });
  };

  var get = function(rid) {
    return utils.gen(utils.get)('Ingredient', rid, null);
  };

  var getAvailableIngredientNameList = function() {

    var executeFunc = function(db, deferred) {

      var result = [];
      db.collection('nutrition').find().each(function(err, doc) {

        if (err) {
          console.log(err);
          deferred.resolve(false);
          return;
        }

        if (!doc) {
          db.close();
          deferred.resolve(result);
        } else {
          if (doc.name) {
            result.push(doc.name);
          }
        }
      });
    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunc);
    return promise;

  };

  var removeIngredientBy_id = function(_id) {

    var executeFunc = function(db, deferred) {

      if (!_id) {
        deferred.resolve(false);
        return;
      }

      var query = {
        '_id': _id
      };
      db.collection('Ingredient').remove(query, function(err, result) {

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
    return utils.gen(utils.remove)('Ingredient', rid, null, index);
  };

  var updateIngredientBy_id = function(_id, ingredient, amount, userID) {

    var executeFunc = function(db, deferred) {

      if (!_id) {
        deferred.resolve(false);
        return;
      }

      var query = {
        '_id': _id
      };
      var updateQuery = {
        '$set': {
          'ingredient': ingredient,
          'amount': amount,
          'userID': userID
        }
      };
      db.collection('Ingredient').update(query, updateQuery, function(err, count, status) {

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

  var edit = function(rid, ingredient, amount, sender, index) {
    return utils.gen(utils.edit)('Ingredient', rid, {
      ingredient: ingredient,
      amount: amount,
      sender: sender
    }, index);
  };

  return {
    'insertIngredient': insert,
    'getIngredients': get,
    'removeIngredientBy_id': removeIngredientBy_id,
    'updateIngredientBy_id': updateIngredientBy_id,
    getAvailableIngredientNameList: getAvailableIngredientNameList,
    insert: insert,
    add: add,
    edit: edit,
    remove: remove,
    get: get
  };

})();

exports.IngredientMongoHelper = IngredientMongoHelper;
