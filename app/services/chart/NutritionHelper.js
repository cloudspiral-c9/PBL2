
var NutritionMongoHelper = require(__dirname + '/NutritionMongoHelper.js').NutritionMongoHelper;
var deferred = require('deferred');


//要amount系の実装
var NutritionHelper = (function() {


	var _calcNutritionRate = function(nutrition, idealNutrition) {

		if ( !(nutrition && idealNutrition) ) {
			return null;
		}

		var retDoc = {'ingredient': nutrition.name, 'rates': {}};
		
		var rates = new Object();
		Object.keys(nutrition).forEach(function(nutritionName) {
			
			//idealNutritionにない要素はスキップ
			if (!idealNutrition[nutritionName]) {
				return;
			}

			var rate = nutrition[nutritionName] / idealNutrition[nutritionName];
			rates[nutritionName] = rate;
		});

		retDoc.rates = rates;
		return retDoc;
	};

	//DBからidealNutritionとingredientDataに対応するnutiritonのデータを取得し，
	//栄養価の割合データを返す．
	var getNutritionRates = function(ingredientData) {

		var def = deferred();

		if (!ingredientData) {
			def.resolve(false)
			return def.promise;
		}
		
		//ratesのデータを作成する
		NutritionMongoHelper.getIdealNutrition()
		.done(function(idealNutrition) {

			NutritionMongoHelper.getNutrition(ingredientData)
			.done(function(nutrition) {

				var retData = _calcNutritionRate(nutrition, idealNutrition);
				def.resolve(retData);

			}, function(err) {
				console.log(err);
				def.resolve(retData);
			});

		}, function(err) {
			console.log(err);
			def.resolve(retData);
		});

		return def.promise;
	}


	var getNutritionDatas = function(rid) {

		var def = deferred();

		if (!rid) {
			def.resolve(false);
			return def.promise;
		}

		var retDataArray = new Array();
		NutritionMongoHelper.getIdealNutrition()
		.done(function(idealNutrition) {

			NutritionMongoHelper.getNutritionsByRid(rid)
			.done(function(nutritionArray) {

				for (var i = 0; i < nutritionArray.length; i++) {
					var nutrition = nutritionArray[i];
					var retDoc = _calcNutritionRate(nutrition, idealNutrition);
					retDataArray.push(retDoc);
				}

				def.resolve(retDataArray);

			}, function(err) {
				console.log(err);
				def.resolve(false);
			});

		}, function(err) {
			console.log(err);
			def.resolve(false);
		});

		return def.promise;

	}
	
	return {'getNutritionRates': getNutritionRates, 'getNutritionDatas': getNutritionDatas};

})();

exports.NutritionHelper = NutritionHelper;

