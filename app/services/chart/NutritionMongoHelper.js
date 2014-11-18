'use strict';

var MongoUtil = require(__dirname + '/../util/MongoUtil.js');
var IngredientMongoHelper = require(__dirname + '/../ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var deferred = require('deferred');
var _ = require('underscore-contrib');


var NutritionMongoHelper = (function() {

  //一食あたりの目安の栄養価を取得する
  var getIdealNutrition = function() {

    var executeFunc = function(db, deferred) {

      db.collection('idealNutrition').findOne({}, function(err, doc) {

        db.close();

        if (err) {
          console.log(err);
          deferred.resolve(false);
          return;
        }

        delete doc._id;
        deferred.resolve(doc);
      });
    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunc);
    return promise;
  };

  var _calcNutritionToAmount = function(nutrition, amount) {

    Object.keys(nutrition).forEach(function(nutritionName) {

      if (nutritionName === 'name' || !_.isNumber(nutrition[nutritionName]) || !_.isNumber(amount)) {
        return;
      }

      nutrition[nutritionName] *= amount;
    });

    return nutrition;
  };

  //ingredientに対応する栄養価を取得する
  var getNutrition = function(ingredientData) {

    var executeFunc = function(db, deferred) {

      if (!(ingredientData.ingredient && ingredientData.amount)) {
        db.close();
        deferred.resolve(null);
        return;
      }

      var amount = ingredientData.amount;
      var query = {
        'name': ingredientData.ingredient
      };
      db.collection('nutrition').findOne(query, function(err, nutrition) {

        db.close();

        if (err) {
          console.log(err);
          deferred.resolve(false);
          return;
        }

        delete nutrition._id;
        var calcedNutrition = _calcNutritionToAmount(nutrition, amount);
        deferred.resolve(calcedNutrition);
      });
    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunc);
    return promise;
  };


  //ingredientDataの配列からorクエリを作成する
  var _makeFoodAmountMap = function(ingredientDatas) {

    var foodAmountMap = {};

    _.each(ingredientDatas, function(value, key, list) {

      if (!(value.ingredient && value.amount)) {
        return;
      }

      foodAmountMap[value.ingredient] = value.amount;

    });

    return foodAmountMap;
  };

  var _makeOrQuery = function(foodAmountMap) {

    var orArray = [];
    Object.keys(foodAmountMap).forEach(function(ingredient) {
      orArray.push({
        'name': ingredient
      });
    });

    var query = (orArray.length === 0 ? {} : {
      '$or': orArray
    });
    return query;
  };


  //ridに対応する部屋のnutritionをかえす．
  var getNutritionsByRid = function(rid) {

    var executeFunction = function(db, deferred) {

      IngredientMongoHelper.getIngredients(rid)
        .done(function(ingredientDatas) {

          console.log("getNutritionsByRid ingredientDatas", ingredientDatas);

          var foodAmountMap = _makeFoodAmountMap(ingredientDatas);
          console.log("getNutritionsByRid foodAmountMap", foodAmountMap);

          var query = _makeOrQuery(foodAmountMap);
          console.log("getNutritionsByRid query", query);

          if (!_.isEmpty(query)) {
            var cursor = db.collection('nutrition').find(query);

            var result = [];
            cursor.each(function(err, nutrition) {

              if (err) {
                console.log(err);
                deferred.resolve(false);
                return;
              }

              if (!nutrition) {
                console.log('no nutirion', result);
                db.close();

                var re = {};
                _.each(result, function(val, key, list) {
                  _.each(val, function(v, k) {
                    if (k !== "name") {
                      re[k] = _.cat(re[k] ? re[k] : [], [v]);
                    }
                  });
                });

                _.each(re, function(val, key, list){
                  re[key] = _.reduce(val, function(memo, v){
                    return memo + v;                 
                  }, 0);
                });

                deferred.resolve(_.map(_.filter(re, function(val, key, list){
                    return (val !== 0);
                }), function(val, key, list){                  
                  return {
                    nutrition: key,
                    rate: 1,
                    rateDetail: val.toString() + ' / ' + val.toString()
                  };
                }));
                return;
              } else {

                var amount = foodAmountMap[nutrition.name];

                delete nutrition._id;
                var retDoc = _calcNutritionToAmount(nutrition, amount);
                result.push(retDoc);
              }
            });
          } else {
            db.close();
            deferred.resolve(false);
            return;
          }

        }, function(err) {
          console.log(err);
          deferred.resolve(false);
        });
    };

    var promise = MongoUtil.executeMongoUseFunc(executeFunction);
    return promise;

  };



  return {
    'getNutrition': getNutrition,
    'getIdealNutrition': getIdealNutrition,
    'getNutritionsByRid': getNutritionsByRid
  };

})();

//外部モジュールにメソッドを公開
exports.NutritionMongoHelper = NutritionMongoHelper;
