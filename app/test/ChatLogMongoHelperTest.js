
var ChatLogMongoHelper = require(__dirname + '/../services/chat/ChatLogMongoHelper.js').ChatLogMongoHelper;
var LoginMongoHelper = require(__dirname + '/../services/login/LoginMongoHelper.js').LoginMongoHelper;
var MongoTestHelper = require(__dirname + '/MongoTestHelper.js').MongoTestHelper;
var TimestampHelper = require(__dirname + '/../services/util/TimestampHelper.js');
var assert = require('assert');

var user = {'userID': '117100601559522934217', 'userName': '水野聖也'};
var now = TimestampHelper.getTimestamp();

var rid = 1;
var chat1 = {'message': 'test1', 'userID': user.userID , 'timestamp': now};
var chat2 = {'message': 'test2', 'userID': user.userID , 'timestamp': now};
var chatlogTest = function() {
	
	MongoTestHelper.clearCollection('login')
	.done(function(result) {

		MongoTestHelper.clearCollection('ChatLog')
		.done(function(result) {

			LoginMongoHelper.insertLoginUserId(user.userID, user.userName)
			.done(function(result) {

				ChatLogMongoHelper.insertMessage(rid, chat1.message, chat1.userID, chat1.timestamp)
				.done(function(result) {

					ChatLogMongoHelper.insertMessage(rid, chat2.message, chat2.userID, chat2.timestamp)
					.done(function(result) {

						ChatLogMongoHelper.getChatLog(rid, 0, 2)
						.done(function(chatlog) {

							console.log(chatlog);
							var _id2 = chatlog[0]._id;
							
							delete chatlog[0]._id;
							delete chatlog[1]._id;
						
							delete chat1.userID;
							delete chat2.userID;
							chat1.userName = user.userName;
							chat2.userName = user.userName;
							
							var expected = [chat2, chat1];
							assert.deepEqual(chatlog, expected);

							ChatLogMongoHelper.removeMessageBy_id(_id2)
							.done(function(result) {

								ChatLogMongoHelper.getChatLog(rid, 0, 2)
								.done(function(chatlog2) {

									console.log(chatlog2);
									var expected = [chat1];
									delete chatlog2[0]._id;
									assert.deepEqual(chatlog2, expected);

								}, function(err) {})

							}, function(err) {});

						}, function(err) {})

					}, function(err) {})

				}, function(err) {});

			}, function(err) {})

		}, function(err) {});
	
	}, function(err) {})

};

chatlogTest();