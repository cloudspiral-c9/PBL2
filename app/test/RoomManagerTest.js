

var assert = require('assert');
var RoomManager = require( __dirname + '/../services/login/RoomManager.js').RoomManager;
var MongoTestHelper = require( __dirname + '/MongoTestHelper.js').MongoTestHelper;
var TimestampHelper = require( __dirname + '/../services/util/TimestampHelper.js');

var description = 'This is Test Room1';
var title = 'testRoom1';
var limit = 2;
var type = 'gachi';

var user1 = {'userID': '117100601559522934217', 'userName': '水野聖也'};
var user2 = {'userID': '115834882653598693998', 'userName': 'Seiya Mizuno'};

var members = [user1];
var expected = {'rid': 1, 'description': description, 'title': title, 'limit': limit, 'type': type};

MongoTestHelper.clearCollection('RoomNumber')
.done(function(res) {

	MongoTestHelper.clearCollection('Room')
	.done(function(res2) {

		RoomManager.createNewRoom(description, title, limit, user1.userID, user1.userName, type)
		.done(function(room) {
			console.log('room1');
			console.log(room);
			delete room.timestamp;
			assert.deepEqual(room, expected);

			RoomManager.getRoom(1)
			.done(function(room2) {
				
				console.log('room2')
				console.log(room2)
				delete room2.timestamp;
				expected.members = members;
				assert.deepEqual(room2, expected);

				RoomManager.isExist(1)
				.done(function(isExist) {

					assert.strictEqual(isExist, true);

				}, function(err) {});

				RoomManager.isExist(2)
				.done(function(isExist2) {

					assert.strictEqual(isExist2, false);
				
				}, function(err) {})

				RoomManager.addMember(1, user2.userID, user2.userName)
				.done(function(result3) {


					RoomManager.getRoom(1)
					.done(function(room3) {

						console.log('room3');
						console.log(room3);
						expected.members = [user1, user2];
						delete room3.timestamp;
						assert.deepEqual(room3, expected);

						RoomManager.isMemberOf(1, user1.userID)
						.done(function(isMember) {
							
							assert.strictEqual(isMember, true);
							RoomManager.addMember(1, 'hogehoge2', 'hogename')
							.done(function(result8) {
								assert.strictEqual(result8, false);

								RoomManager.removeMember(1, user2.userID)
								.done(function(result5) {

									RoomManager.getRoom(1)
									.done(function(room4) {

										console.log('room4');
										console.log(room4);
										delete room4.timestamp;
										expected.members = [user1];
										assert.deepEqual(room4, expected);

										RoomManager.removeRoom(1)
										.done(function(res6) {

											RoomManager.isExist(1)
											.done(function(isExistRoom) {

												assert.strictEqual(isExistRoom, false);

											}, function(err) {});

										}, function(err) {});

									}, function(err) {})
								});


							}, function(err) {})
						});

						RoomManager.isMemberOf('hogehoge')
						.done(function(isMember2) {
							assert.strictEqual(isMember2, false);
						}, function(err) {})

					}, function(err) {})

				}, function(err) {});

			});

		}, function(err) {});

	}, function(err) {});

}, function(err) {})