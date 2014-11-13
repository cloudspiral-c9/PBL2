'use strict';

var def = require('deferred');
var csbsChart = require('csbsChart');
var csbsChatLog = require('csbsChatLog');
var csbsIngredient = require('csbsIngredient');
var csbsRecipeList = require('csbsRecipeList');
var csbsRecipeProcess = require('csbsRecipeProcess');

var socket;

(function() {

  var io, sockets;

  function _start(server) {

    io = require('socket.io')(server);
    sockets = {};

    io.sockets.on('connection', function(socket) {

      socket.emit('ready', {
        id: socket.id
      });

      var chart, chatLog, ingredient, recipelist, recipeProcess, defC;

      defC = def();

      sockets[socket.id] = socket;

      csbsChart(socket).then(function(rObs) {
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

      csbsChatLog(socket).then(function(rObs) {
        chatLog = rObs;
      });

      csbsIngredient(socket).then(function(rObs) {
        ingredient = rObs;
        defC.resolve();
      });

      csbsRecipeList(socket).then(function(rObs) {
        recipelist = rObs;
      });

      csbsRecipeProcess(socket).then(function(rObs) {
        recipeProcess = rObs;
      });

    });

  }

  socket = {
    io: function() {
      return io;
    },
    start: _start,
    sockets: function() {
      return sockets;
    }
  };

})();

module.exports = socket;
