'use strict';

var RoomManager = require(__dirname + '/../../services/login/RoomManager.js').ChatLogMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsRecipeList = {};

(function() {

  function _obs(sockets, id) {

    var d = def();

    csbs.observable('recipelist', {
        receive: function(event, setReceived) {
          sockets()[id].socket.on(event, function(data) {
            setReceived(data);
          });
        },
        send: function(event, data) {
          sockets()[id].socket.broadcast.emit(event, data);
        },
        edit: function() {},
        insert: function() {},
        remove: function() {},
        add: function(data) {
          return RoomManager.get(
            data.values[0].description, 
            data.values[0].title, 
            data.values[0].limit, 
            data.values[0].userID, 
            data.values[0].userName, 
            data.values[0].type);
        }
      }, ['title', 'userID','userName', 'description', 'rid', 'timestamp', 'members', 'limit'], 'deferred').start(function(){
        return RoomManager.get();
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsRecipeList.obs = _obs;

})();

module.exports = csbsRecipeList;
