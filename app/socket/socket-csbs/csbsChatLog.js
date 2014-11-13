'use strict';

var ChatLogMongoHelper = require(__dirname + '/../../services/chat/ChatLogMongoHelper.js').ChatLogMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsChat = {};

(function() {

  function _obs(socket, io) {

    var d = def();

    csbs.observable('chats', {
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        },
        send: function(event, data) {
          socket.to(io.sockets.manager.roomClients[socket.id]).emit(event, data);
        },
        edit: function() {},
        insert: function() {},
        remove: function() {},
        add: function(data) {
          return ChatLogMongoHelper.add(
            io.sockets.manager.roomClients[socket.id], 
            data.values[0].message,
            data.values[0].sender,
            TimestampHelper.getTimestamp()
          );
        }
      }, ['message', 'sender', 'timestamp'], 'deferred').start(function(){
        return ChatLogMongoHelper.get(io.sockets.manager.roomClients[socket.id]);
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsChat.obs = _obs;

})();

module.exports = csbsChat;
