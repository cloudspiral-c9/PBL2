'use strict';

var _ = require('underscore-contrib');

var MongoUtil = require(__dirname + '/../util/MongoUtil.js');

var utils = {};

(function() {

  //使い方
  //insertRecipeProcess = funciton(rid, process, sender, index, now){
  //  return utils.gen(utils.insert)('Process',rid, {
  //    process: process,
  //    sender: sender,
  //    timestamp: now
  //  }, index);
  //}

  utils.gen = function(fun) {

    return function(col, rid, value, index) {

      return MongoUtil.executeMongoUseFunc(function(db, def) {

        if (!(_.truthy(rid) && _.every(value, function(value) {
            return _.truthy(value);
          }))) {
          db.close();
          def.resolve(false);
          return;
        }

        fun(col, rid, value, index, db, def);
      });
    };

  };

  utils.cb = function(db, def) {
    return function(e, doc) {
      db.close();
      if (e) {
        console.log(e);
        def.resolve(false);
        return;
      }
      def.resolve(doc.values);
    };
  };

  utils.start = function(col, rid, value, index, db, def) {
    db.collection(col).insert({
      rid: rid,
      values: []
    },utils.cb(db, def));
  };

  utils.insert = function(col, rid, value, index, db, def) {
    db.collection(col).update({
      rid: rid
    }, {
      $push: {
        values: {
          $each: [value],
          $position: index
        }
      }
    }, utils.cb(db, def));
  };

  utils.add = function(col, rid, value, index, db, def) {
    db.collection(col).update({
      rid: rid
    }, {
      $push: {
        values: value
      }
    }, utils.cb(db, def));
  };

  utils.get = function(col, rid, value, index, db, def) {
    db.collection(col).find({
      rid: rid
    }, utils.cb(db, def));
  };

  utils.genGetOpt = function(opt) {
    return function(col, rid, value, index, db, def) {

      db.collection(col).find({
        rid: rid
      }, function(e, doc) {
        db.close();
        if (e) {
          console.log(e);
          def.resolve(false);
          return;
        }

        if (_.truthy(opt.sort)) {
          doc.values = _.sortBy(doc.values, opt.sort);
        }
        if (_.truthy(opt.pos)) {
          doc.values = _.takeSkipping(doc.values, opt.pos);
        }
        if (_.truthy(opt.limit)) {
          doc.values = _.first(doc.values, opt.limit);
        }

        def.resolve(doc.values);
      });
    };
  };

  utils.remove = function(col, rid, value, index, db, def) {
    db.collection(col).find({
      rid: rid
    }, function(err, result) {
      db.close();
      if (err) {
        console.log(err);
        def.resolve(false);
        return;
      }
      db.collection(col).update({
        rid: rid
      }, {
        $set: {
          values: result.values.splice(index, 1)
        }
      }, utils.cb(db, def));
    });
  };

  utils.edit = function(col, rid, value, index, db, def) {
    db.collection(col).find({
      rid: rid
    }, function(err, result) {
      db.close();
      if (err) {
        console.log(err);
        def.resolve(false);
        return;
      }
      db.collection(col).update({
        rid: rid
      }, {
        $set: {
          values: result.values.splice(index, 1, value)
        }
      }, utils.cb(db, def));
    });
  };

})();

module.exports = utils;
