'use strict';

var RecipeProcessMongoHelper = require(__dirname + '/../../services/process/RecipeProcessMongoHelper.js').RecipeProcessMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');
var _ = require('underscore-contrib');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsRecipeProcess = {};

(function() {

  function _obs(sockets, id) {

    var d = def();

    csbs.observable('processes', {
        receive: function(event, setReceived) {
          sockets()[id].socket.on(event, function(data) {
            console.log('receive' ,data);
            if (_.exists(data.values) &&_.exists(data.values[0]) && _.exists(data.values[0].timestamp)) {
              data.values[0].timestamp = TimestampHelper.getTimestamp();
            }
            setReceived(data);
          });
        },
        send: function(event, data) {
          console.log('send' ,data);
          console.log('rid' ,sockets()[id].rid);
          sockets().io.to(sockets()[id].rid).emit(event, data);
        },
        edit: function(data) {
          console.log('edit' ,data);
          return RecipeProcessMongoHelper.edit(
            sockets()[id].rid,
            data.values[0].process,
            data.values[0].sender,
            data.index,
            data.values[0].timestamp
          );
        },
        insert: function(data) {
          console.log('insert' ,data);
          return RecipeProcessMongoHelper.insert(
            sockets()[id].rid,
            data.values[0].process,
            data.values[0].sender,
            data.index,
            data.values[0].timestamp
          );
        },
        remove: function(data) {
          console.log('remove' ,data);
          return RecipeProcessMongoHelper.remove(
            sockets()[id].rid,
            data.index
          );
        },
        add: function(data) {
          console.log('time' ,TimestampHelper.getTimestamp());
          console.log('add' ,data);
          return RecipeProcessMongoHelper.add(
            sockets()[id].rid,
            data.values[0].process,
            data.values[0].sender,
            data.values[0].timestamp
          );
        }
      }, ['process', 'sender', 'timestamp'], 'deferred').start(function() {
        return RecipeProcessMongoHelper.get(sockets()[id].rid);
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsRecipeProcess.obs = _obs;

})();

module.exports = csbsRecipeProcess;
