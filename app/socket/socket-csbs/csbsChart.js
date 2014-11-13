'use strict';

var NutritionHelper = require(__dirname + '/../../services/chart/NutritionHelper.js').NutritionHelper;
var NutritionMongoHelper = require(__dirname + '/../../services/chart/NutritionMongoHelper.js').NutritionMongoHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsChart = {};

(function() {

  function _obs(socket, io) {

    var d = def();

    csbs.observable('chart', {
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        },
        send: function(event, data) {
          socket.to(io.sockets.manager.roomClients[socket.id]).emit(event, data);
        },
        edit: function(){
          var d = def();
          d.resolve();
          return d.promise;
        },
        insert: function() {},
        remove: function() {},
        add: function() {}
      }, ['ingredient', 'rate', 'rateDetail'], 'deferred').start(function(){
        return NutritionMongoHelper.getNutritionsByRid(io.sockets.manager.roomClients[socket.id]);
      })
      .then(function(rObs) {
        d.resolove(rObs);
      });

    return d.promise;
  }

  csbsChart.obs = _obs;

})();

module.exports = csbsChart;
