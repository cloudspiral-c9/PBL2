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

  utils.cb = function(db, def, col, rid) {
    return function(e, doc) {
      db.close();
      if (e) {
        console.log(e);
        def.resolve(false);
        return;
      }
      console.log('utils.cb doc ' + col + rid, doc);
      def.resolve(doc.values);
    };
  };

  utils.cbGet = function(col, rid, value, index, db, def) {
    return function(e, doc) {
      utils.get(col, rid, value, index, db, def);
    };
  };

  utils.start = function(col, rid, value, index, db, def) {
    db.collection(col).insert({
      rid: rid,
      values: []
    }, utils.cbGet(col, rid, value, index, db, def));
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
    }, utils.cbGet(col, rid, value, index, db, def));
  };

  utils.add = function(col, rid, value, index, db, def) {
    db.collection(col).update({
      rid: rid
    }, {
      $push: {
        values: value
      }
    }, utils.cbGet(col, rid, value, index, db, def));
  };

  utils.get = function(col, rid, value, index, db, def) {
    db.collection(col).findOne({
      rid: rid
    }, function(e, doc) {
      if (e || !_.exists(doc) || !_.isArray(doc.values)) {
        console.log(e);
        def.resolve(false);
        return;
      }
      utils.cb(db, def, col, rid)(e, doc);
    });
  };

  utils.genGetOpt = function(opt) {
    return function(col, rid, value, index, db, def) {

      db.collection(col).findOne({
        rid: rid
      }, function(e, doc) {
        db.close();
        if (e || !_.exists(doc) || !_.isArray(doc.values)) {
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
    db.collection(col).findOne({
      rid: rid
    }, function(e, doc) {
      if (e || !_.exists(doc) || !_.isArray(doc.values)) {
        console.log(e);
        def.resolve(false);
        return;
      }
      doc.values.splice(index, 1);
      db.collection(col).update({
        rid: rid
      }, {
        $set: {
          values: doc.values
        }
      }, utils.cbGet(col, rid, value, index, db, def));
    });
  };

  utils.edit = function(col, rid, value, index, db, def) {
    db.collection(col).findOne({
      rid: rid
    }, function(e, doc) {
      if (e || !_.exists(doc) || !_.isArray(doc.values)) {
        console.log(e);
        def.resolve(false);
        return;
      }
      doc.values.splice(index, 1, value);
      db.collection(col).update({
        rid: rid
      }, {
        $set: {
          values: doc.values
        }
      }, utils.cbGet(col, rid, value, index, db, def));
    });
  };

})();

module.exports = utils;
