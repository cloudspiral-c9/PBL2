'use strict';

var NutritionHelper = require( __dirname + '/../../services/chart/NutritionHelper.js').NutritionHelper;
var IngredientMongoHelper = require( __dirname + '/../../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var RoomManager = require( __dirname + '/../../services/login/RoomManager.js').RoomManager;
var TimestampHelper = require( __dirname + '/../../services/util/TimestampHelper.js');
var deferred = require('deferred');

var IngredientEventModule = {
	
	ns: '/ingredient',
	io: null,
	socket: null,

	eventHandlerMap: {
		
		enterRoom: function(data, resFunc) {
			
			if ( !(data.rid && data.sender) ) {
				resFunc(false);
			}	
				
			var that = this;	
			var rid = data.rid;
			var userId = data.sender;
			RoomManager.isMemberOf(rid, userId)
			.done(function(isMember) {

				if (isMember) {
					that.socket.join(rid);
					resFunc(true);
				} else {
					resFunc(false);
				}


			}, function(err) {
				console.log(err);
				resFunc(err);
			});
		}, 

		leaveRoom: function(data, resFunc) {
			this.socket.leave();
			this.socket.close();
			resFunc(true);
		},
		

		sendIngredient: function(data, resFunc) {
		
			if (!(data.rid && data.ingredient && data.sender && data.amount)) {
				resFunc(false);
				return;
			}

			var rid = data.rid;
			var ingredient = data.ingredient;
			var amount = data.amount;
			var sender = data.sender;
			var ingredientData = {'ingredient': ingredient, 'amount': amount, 'sender': sender};
			IngredientMongoHelper.insertIngredient(rid, ingredient, amount, sender)
			.done(function(result) {
				
				if (!result) {
					resFunc(false);
					return;
				}

				NutritionHelper.getNutritionRates(ingredientData)
				.done(function(nutrition) {
					
					if (!nutrition && nutrition !== null) {
						resFunc(false);
						return;
					}

					var now = TimestampHelper.getTimestamp();
					var resObject = {'nutrition': nutrition, 'ingredient': ingredient};
					this.io.to(data.rid).emit('broadcastAddFood', resObject, function(data) {});
					resFunc(true);
				}, 

				function(err) {
					console.log(err);
					resFunc(false);
				});

			},

			function(err) {
				console.log(err);
				resFunc(false);
			});

		}
	}
};

exports.IngredientEventModule = IngredientEventModule;