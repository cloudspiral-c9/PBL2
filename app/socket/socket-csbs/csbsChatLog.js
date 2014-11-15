'use strict';

var ChatLogMongoHelper = require(__dirname + '/../../services/chat/ChatLogMongoHelper.js').ChatLogMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');
var _ = require('underscore-contrib');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsChat = {};

(function() {

  function _obs(sockets, id) {

    var d = def();

    csbs.observable('chats', {
        receive: function(event, setReceived) {
          sockets()[id].socket.on(event, function(data) {
            console.log('receive', data);
            if (_.exists(data.values[0]) && _.exists(data.values[0].timestamp)) {
              data.values[0].timestamp = TimestampHelper.getTimestamp();
            }
            setReceived(data);
          });
        },
        send: function(event, data) {
          console.log('send', data);
          console.log('rid', sockets()[id].rid);
          console.log('sockets', sockets());
          console.log('rooms', sockets()[id].socket.rooms);
          console.log('id', id);
          sockets().io.to(sockets()[id].rid).emit(event, data);
        },
        edit: function() {},
        insert: function() {},
        remove: function() {},
        add: function(data) {
          console.log('add', data);
          console.log('time', data.values[0].timestamp);
          return ChatLogMongoHelper.add(
            sockets()[id].rid,
            data.values[0].message,
            data.values[0].sender,
            data.values[0].timestamp
          );
        }
      }, ['message', 'sender', 'timestamp'], 'deferred').start(function() {
        return ChatLogMongoHelper.get(sockets()[id].rid);
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsChat.obs = _obs;

})();

module.exports = csbsChat;
