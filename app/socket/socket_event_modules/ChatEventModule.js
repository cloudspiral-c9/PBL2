
var ChatLogMongHelper = require( __dirname + '/../../services/chat/ChatLogMongoHelper.js').ChatLogMongoHelper;
var RoomManager = require( __dirname + '/../../services/login/RoomManager.js').RoomManager;
var TimestampHelper = require( __dirname + '/../../services/util/TimestampHelper.js');

var ChatEventModule = {
	
	ns: '/chat',
	io: null,
	socket: null,

	eventHandlerMap: {
		
		//部屋のメンバーか確認
		//部屋のメンバーなら，ソケットのチャネルを設定しtrueを返す．
		enterRoom: function(data, resFunc) {
			
			if ( !(data.rid && data.sender) ) {
				resFunc(false);
				return;
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

		//ソケットを切断
		leaveRoom: function(data, resFunc) {
			this.socket.leave();
			this.socket.close();
			resFunc(true);
		},


		sendMessage: function(data, resFunc) {
			
			if (!(data.rid && data.message && data.sender)) {
				resFunc(false);
				return;
			}

			var rid = data.rid;
			var message = data.message;
			var userId = data.sender;

			RoomManager.isMemberOf(rid, userId)
			.done(function(isMember) {

				if (isMember) {

					var now = TimestampHelper.getTimestamp();
					ChatLogMongoHelper.insertMessage(rid, message, userId, now)
					
					.done(function(isSucceed) {
						
						if (isSucceed) {
							var resObject = {'message': data.message, 'sender': data.sender, 'timestamp': now};
							this.io.to(data.rid).emit('broadcastSendMessage', resObject, function(data) {});
							resFunc(resObject);
						} else {
							resFunc(false);
						}
						
					},

					function(err) {
						console.log(err);
						resFunc(err);
					});

				} else {
					resFunc(false);
				}

			}, function(err) {
				console.log(err);
				resFunc(err);
			});
			
		},

		loadChatLog: function(data, resFunc) {

			if (!(data.rid && data.pos && data.num && data.sender)) {
				resFunc(false);
				return;
			}

			var rid = data.rid;
			var pos = data.pos;
			var num = data.num;
			var userId = data.sender;

			RoomManager.isMemberOf(rid, userId)
			.done(function(isMember) {

				if (isMember) {

					ChatLogMongoHelper.getChatLog(rid, pos, num)
					.done(function(result) {
						resFunc(result);
					}, 

					function(err) {
						console.log(err);
						resFunc(err);
					});
				} else {
					resFunc(false);
				}
				
			}, function(err) {
				console.log(err);
				resFunc(false);
			});
			
		}
	}
};

exports.ChatEventModule = ChatEventModule;