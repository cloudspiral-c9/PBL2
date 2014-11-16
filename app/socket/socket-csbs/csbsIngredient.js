'use strict';

var IngredientMongoHelper = require(__dirname + '/../../services/ingredient/IngredientMongoHelper.js').IngredientMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');
var _ = require('underscore-contrib');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsIngredient = {};

(function() {

  function _obs(sockets, id) {

    var d= def();

    csbs.observable('ingredients', {
        receive: function(event, setReceived) {
          sockets()[id].socket.on(event, function(data) {
            console.log('receive' ,data);
            if (_.exists(data.values) && _.exists(data.values[0]) && _.exists(data.values[0].timestamp)) {
              data.values[0].timestamp = TimestampHelper.getTimestamp();
            }
            setReceived(data);
          });
        },
        send: function(event, data) {
          sockets().io.to(sockets()[id].rid).emit(event, data);
          console.log('send' ,data);
          console.log('rid' ,sockets()[id].rid);
        },
        edit: function(data) {
          console.log('edit' ,data);
          return IngredientMongoHelper.edit(
            sockets()[id].rid,
            data.values[0].ingredient,
            data.values[0].amount,
            data.values[0].sender,
            data.values[0].timestamp,
            data.index
          );
        },
        insert: function(data) {
          console.log('insert', data);
          return IngredientMongoHelper.insert(
            sockets()[id].rid,
            data.values[0].ingredient,
            data.values[0].amount,
            data.values[0].sender,
            data.values[0].timestamp,
            data.index
          );
        },
        remove: function(data) {
          console.log('remove', data);
          return IngredientMongoHelper.remove(
            sockets()[id].rid
          );
        },
        add: function(data) {
          return IngredientMongoHelper.add(
            sockets()[id].rid,
            data.values[0].ingredient,
            data.values[0].amount,
            data.values[0].sender,
            data.values[0].timestamp
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
