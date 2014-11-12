'use strict';

var RecipeProcessMongoHelper = require( __dirname + '/../../services/process/RecipeProcessMongoHelper.js').RecipeProcessMongoHelper;
var TimestampHelper = require( __dirname + '/../../services/util/TimestampHelper.js');

var RecipeProcessEventModule = {
	
	ns: '/process',
	io: null,
	socket: null,

	eventHandlerMap: {
		
		enterRoom: function(data, resFunc) {

			if ( !(data.rid && data.sender) ) {
				resFunc(false);
				return;
			}	
			
			var that = this;
			var rid = data.rid;
			var userId = data.sender;
			RoomManager.isMemberOf(rid, userId)
			.done(function(isMemeber) {

				if (isMember) {
					that.socket.join(rid);
					resFunc(true);
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

		sendProcess: function(data, resFunc) {

			if ( !(data.rid && data.process && data.sender) ) {
				resFunc(false);
				return;
			}

			var rid = data.rid;
			var process = data.process;
			var userId = data.sender;
			var index = !data.index ? null : data.index;

			RoomManager.isMemberOf(rid, userId)
			.done(function(isMember) {

				if (isMember) {

					var now = TimestampHelper.getTimestamp();
					RecipeProcessMongoHelper.insertRecipeProcess(rid, process, userId, index, now)
			
					.done(function(isSucceed) {
				
						if (isSucceed) {
						
							var resObject = {'process': process, 'sender': userId, 'timestamp': now};
							if (data.index) {
								resObject.index = data.index;
							}
							this.io.to(data.rid).emit('broadcastSendProcess', resObject, function(data) {});
							resFunc(true);
						
						} else {
							resFunc(false);
						}
					},

					function(err) {
						console.log(err)
						resFunc(err);
					});

				} else {
					resFunc(false);
				}


			}, function(err) {
				console.log(err);
				resFunc(err);
			});
		}
	}
};

exports.RecipeProcessEventModule = RecipeProcessEventModule;