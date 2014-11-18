'use strict';

var NutritionHelper = require(__dirname + '/../../services/chart/NutritionHelper.js').NutritionHelper;
var TimestampHelper = require(__dirname + '/../../services/util/TimestampHelper.js');

var def = require('deferred');
var csbs = require('csbind-server');

var csbsChart = {};

(function() {

  function _obs(sockets, id) {

    var d = def();

    csbs.observable('chart', {
        receive: function(event, setReceived) {
          sockets()[id].socket.on(event, function(data) {
            console.log('receive' ,data);
            setReceived(data);
          });
        },
        send: function(event, data) {
          console.log('send chart' ,data);
          console.log('rid' ,sockets()[id].rid);
          sockets().io.to(sockets()[id].rid).emit(event, data);
        },
        edit: function(){
          var d = def();
          d.resolve();
          return d.promise;
        },
        insert: function() {},
        remove: function() {},
        add: function() {}
      }, ['nutrition', 'rate', 'rateDetail'], 'deferred').start(function(){
        return NutritionHelper.getNutritionDatas(sockets()[id].rid);
      })
      .then(function(rObs) {
        d.resolve(rObs);
      });

    return d.promise;
  }

  csbsChart.obs = _obs;

})();

module.exports = csbsChart;
