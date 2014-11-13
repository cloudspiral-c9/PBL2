'use strict';

var RecipeProcessMongoHelper = require(__dirname + '/../../services/process/RecipeProcessMongoHelper.js').RecipeProcessMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsRecipeProcess = {};

(function() {

  function _obs(socket, io) {

    var d = def();

    csbs.observable('processes', {
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        },
        send: function(event, data) {
          socket.to(io.sockets.manager.roomClients[socket.id]).emit(event, data);
        },
        edit: function(data) {
          return RecipeProcessMongoHelper.edit(
            io.sockets.manager.roomClients[socket.id],
            data.values[0].process,
            data.values[0].sender,
            data.index,
            TimestampHelper.getTimestamp()
          );
        },
        insert: function(data) {
          return RecipeProcessMongoHelper.insert(
            io.sockets.manager.roomClients[socket.id],
            data.values[0].process,
            data.values[0].sender,
            data.index,
            TimestampHelper.getTimestamp()
          );
        },
        remove: function(data) {
          return RecipeProcessMongoHelper.remove(
            io.sockets.manager.roomClients[socket.id],
            data.index
          );
        },
        add: function(data) {
          return RecipeProcessMongoHelper.add(
            io.sockets.manager.roomClients[socket.id],
            data.values[0].process,
            data.values[0].sender,
            TimestampHelper.getTimestamp()
          );
        }
      }, ['process', 'sender', 'timestamp'], 'deferred').start(function() {
        return RecipeProcessMongoHelper.get(io.sockets.manager.roomClients[socket.id]);
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsRecipeProcess.obs = _obs;

})();

module.exports = csbsRecipeProcess;
