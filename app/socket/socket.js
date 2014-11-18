'use strict';

var def = require('deferred');
var _ = require('underscore-contrib');
var csbsChart = require(__dirname + '/socket-csbs/csbsChart.js');
var csbsChatLog = require(__dirname + '/socket-csbs/csbsChatLog.js');
var csbsIngredient = require(__dirname + '/socket-csbs/csbsIngredient.js');
var csbsRecipeList = require(__dirname + '/socket-csbs/csbsRecipeList.js');
var csbsRecipeProcess = require(__dirname + '/socket-csbs/csbsRecipeProcess.js');
var RoomManager = require(__dirname + '/../services/login/RoomManager.js').RoomManager;

var socket, recipelist;

(function() {

  var io, sockets;
  sockets = {};

  function _sockets() {
    return sockets;
  }

  function _start(server) {

    io = require('socket.io')(server);
    sockets.io = io;

    io.sockets.on('connection', function(socket) {

      sockets[socket.id] = {
        socket: socket,
        rid: null,
        user: null
      };

      socket.emit('ready', {
        id: socket.id
      });

      socket.on('user', function(user) {
        sockets[socket.id].user = user;
      });

      var chart, chatLog, ingredient, recipeProcess;


      def((function() {
        var d = def();
        csbsChart.obs(_sockets, socket.id).then(function(rObs) {
          chart = rObs;
          d.resolve();
        });
        return d.promise;
      })(), (function() {
        var d = def();
        csbsIngredient.obs(_sockets, socket.id).then(function(rObs) {
          ingredient = rObs;
          d.resolve();
        });
        return d.promise;
      })()).then(function() {
        ingredient.addUpdates([function() {
          chart.set({
            values: [{
              nutrition: '',
              rate: '',
              rateDetail: ''
            }],
            mode: 'edit',
            index: 1
          });
        }]);
      });

      csbsChatLog.obs(_sockets, socket.id).then(function(rObs) {
        chatLog = rObs;
      });

      csbsRecipeList.obs(_sockets, socket.id).then(function(rObs) {
        recipelist = rObs;
        socket.on('disconnect', function() {
          if (_.exists(sockets[socket.id].rid) && _.exists(sockets[socket.id].user)) {
            RoomManager.removeMember(sockets[socket.id].rid, sockets[socket.id].user.userID)
              (function() {
                sockets[socket.id].socket.leave(sockets[socket.id].rid);
                sockets[socket.id].rid = null;
                delete sockets[socket.id];
              });
          }
        });
      });

      csbsRecipeProcess.obs(_sockets, socket.id).then(function(rObs) {
        recipeProcess = rObs;
      });

    });

  }

  socket = {
    io: function() {
      return io;
    },
    start: _start,
    sockets: _sockets,
    recipelist: function() {
      return recipelist;
    }
  };

})();

module.exports = socket;
