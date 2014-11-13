var IngredientMongoHelper = require(__dirname + '/../../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var deferred = require('deferred');

var GetAvailableIngredientList = {

	route: '/getingredientlist',
	routeFunc: function(queries) {

		var def = deferred();

		IngredientMongoHelper.GetAvailableIngredientList()
		.done(function(foodList) {
			def.resolve(foodList);
		}, function(err) {
			console.log(err);
			def.promise(false);
		});

		return def.promise;
	}

};

exports.GetAvailableIngredientList = GetAvailableIngredientList;

