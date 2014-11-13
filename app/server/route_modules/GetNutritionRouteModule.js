'use strict';

var NutritionHelper = require(__dirname + '/../../services/chart/NutritionHelper.js').NutritionHelper;
var LoginMongoHelper = require(__dirname + '/../../services/login/LoginMongoHelper.js').LoginMongoHelper;
var deferred = require('deferred');

var GetNutritionRouteModule = {

  route: '/getnutrition',
  request: null,
  routeFunc: function(queries) {

    var def = deferred();

    if (!(queries.rid && queries.userID && this.request.user)) {
      def.resolve(false);
      return def.promise;
    }

    var rid = +queries.rid;
    var userId = queries.userID;

    LoginMongoHelper.isLoggedIn(userId)
      .done(function(isLoggedIn) {

        if (isLoggedIn) {
          NutritionHelper.getNutritionDatas(rid)
            .done(function(nutritionDatas) {

              def.resolve(nutritionDatas);

            }, function(err) {
              console.log(err);
              def.resolve(false);
            });
        } else {
          def.resolve(false);
        }

      }, function(err) {
        console.log(err);
        def.resolve(false);
      });

    return def.promise;
  }
};

exports.GetNutritionRouteModule = GetNutritionRouteModule;
