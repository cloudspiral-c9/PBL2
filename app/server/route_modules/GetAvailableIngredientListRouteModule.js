'use strict';

var IngredientMongoHelper = require(__dirname + '/../../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var deferred = require('deferred');

var GetAvailableIngredientListRouteModule = {

  route: '/getingredientlist',
  routeFunc: function(queries) {

    var def = deferred();

    IngredientMongoHelper.getAvailableIngredientNameList()
      .done(function(foodList) {
        def.resolve(foodList);
      }, function(err) {
        console.log(err);
        def.promise(false);
      });

    return def.promise;
  }

};

exports.GetAvailableIngredientListRouteModule = GetAvailableIngredientListRouteModule;
