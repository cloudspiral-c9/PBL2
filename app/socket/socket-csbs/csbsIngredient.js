'use strict';

var IngredientMongoHelper = require(__dirname + '/../../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsIngredient = {};

(function() {

  function _obs(sockets, id) {

    var d= def();

    csbs.observable('ingredients', {
        receive: function(event, setReceived) {
          sockets()[id].socket.on(event, function(data) {
            setReceived(data);
          });
        },
        send: function(event, data) {
          sockets()[id].socket.to(sockets()[id].rid).emit(event, data);
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
            sockets()[id].rid,
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
            sockets()[id].rid,
            data.values[0].ingredient,
            data.values[0].amount,
            data.values[0].sender
          );
        }
      }, ['ingredient', 'sender', 'amount', 'timestamp'], 'deferred').start(function() {
        return IngredientMongoHelper.get(sockets()[id].rid);
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsIngredient.obs = _obs;

})();

module.exports = csbsIngredient;
