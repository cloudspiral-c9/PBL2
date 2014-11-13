'use strict';

var MongoClient = require('mongodb').MongoClient;
var deferred = require('deferred');

//データベースrecipeerを使用する処理を実行するユーティリティ
var executeMongoUseFunc = function(executeFunc) {

  var def = deferred();

  MongoClient.connect('mongodb://localhost/recipeers', function(err, db) {

    //MongoDBに接続できない場合は例外を発生
    if (err) {
      throw err;
    }
    db.authenticate('mizuno', 'saintseiya', function(err, result) {

      if (err) {
        console.log(err);
        db.close();
        throw err;
      } else {
        if (result) {
          executeFunc(db, def);
        }
      }
    });

  });

  return def.promise;
};

exports.executeMongoUseFunc = executeMongoUseFunc;
