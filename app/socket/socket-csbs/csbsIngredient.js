'use strict';

var IngredientMongoHelper = require(__dirname + '/../../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsIngredient = {};

(function() {

  function _obs(socket, io) {

    var d= def();

    csbs.observable('ingredients', {
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        },
        send: function(event, data) {
          socket.to(io.sockets.manager.roomClients[socket.id]).emit(event, data);
        },
        edit: function(data) {
          return IngredientMongoHelper.edit(
            data.values[0]._rid,
            data.values[0].ingredient,
            data.values[0].amount,
            data.values[0].sender,
            data.index
          );
        },
        insert: function(data) {
          return IngredientMongoHelper.insert(
            io.sockets.manager.roomClients[socket.id],
            data.values[0].ingredient,
            data.values[0].amount,
            data.values[0].sender,
            data.index
          );
        },
        remove: function(data) {
          return IngredientMongoHelper.remove(
            data.values[0]._rid
          );
        },
        add: function(data) {
          return IngredientMongoHelper.add(
            io.sockets.manager.roomClients[socket.id],
            data.values[0].ingredient,
            data.values[0].amount,
            data.values[0].sender
          );
        }
      }, ['ingredient', 'sender', 'amount', 'timestamp'], 'deferred').start(function() {
        return IngredientMongoHelper.get(io.sockets.manager.roomClients[socket.id]);
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsIngredient.obs = _obs;

})();

module.exports = csbsIngredient;
