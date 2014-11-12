'use strict';

var NutritionHelperHelper = require(__dirname + '/../../services/chart/NutritionHelper.js').NutritionHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsChart;

(function() {

  function _obs(socket, io) {

    var obs;

    csbs.observable('chart', {
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        },
        send: function(event, data) {
          io.sockets.in(io.sockets.manager.roomClients[socket.id]).emit(event, data);
        },
        edit: function() {},
        insert: function() {},
        remove: function() {},
        add: function() {}
      }, ['ingredient', 'rate', 'rateDetail'], 'deferred').start(function(){
      })
      .then(function(rObs) {
        obs = rObs;
      });

    return obs;
  }

  csbsChart.obs = _obs;

})();

module.exports = csbsChart;
