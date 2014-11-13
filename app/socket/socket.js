'use strict';

var def = require('deferred');
var csbsChart = require(__dirname + '/socket-csbs/csbsChart.js');
var csbsChatLog = require(__dirname + '/socket-csbs/csbsChatLog.js');
var csbsIngredient = require(__dirname + '/socket-csbs/csbsIngredient.js');
var csbsRecipeList = require(__dirname + '/socket-csbs/csbsRecipeList.js');
var csbsRecipeProcess = require(__dirname + '/socket-csbs/csbsRecipeProcess.js');

var socket;

(function() {

  var io, sockets;
  sockets = {};

  function _sockets() {
    return sockets;
  }

  function _start(server) {

    io = require('socket.io')(server);

    io.sockets.on('connection', function(socket) {

      sockets[socket.id] = {
        socket: socket,
        rid: null
      };

      socket.emit('ready', {
        id: socket.id
      });

      var chart, chatLog, ingredient, recipelist, recipeProcess, defC;

      defC = def();

      csbsChart.obs(_sockets, socket.id).then(function(rObs) {
          chart = rObs;
          return defC.promise;
        })
        .then(function() {
          ingredient.addUpdates(function() {
            chart.set({
              values: [{
                ingredient: '',
                rate: '',
                reteDetail: ''
              }],
              mode: 'edit',
              index: 1
            });
          });
        });

      csbsChatLog.obs(_sockets, socket.id).then(function(rObs) {
        chatLog = rObs;
      });

      csbsIngredient.obs(_sockets, socket.id).then(function(rObs) {
        ingredient = rObs;
        defC.resolve();
      });

      csbsRecipeList.obs(_sockets, socket.id).then(function(rObs) {
        recipelist = rObs;
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
    sockets: _sockets
  };

})();

module.exports = socket;
