'use strict';

(function() {
  var chart = angular.module('recipeers.recipe.chart');

  chart.controller('ChartController', ['socket', '$scope', 'csbc', '_', '$http', 'AuthService', 'RecipeService', function(socket, $scope, csbc, _, $http, AuthService, RecipeService) {

    var chartObs;

    //ロジック部分(pure)
    function makeChartData(chart) {

      var chartData, rates, titles, allOne, firstRate;

      rates = '';
      titles = '';
      allOne = '';

      _.each(chart, function(el) {
        if (!firstRate) {
          firstRate = el.rate + ',';
        }
        rates += el.rate + ',';
        titles += '|' + el.nutrition + '(' + el.rateDetail + ')';
        allOne += '1,';
      });

      rates += firstRate;
      allOne += '1,';
      rates = rates.slice(0, -1);
      allOne = allOne.slice(0, -1);

      rates = rates + '|' + allOne;
      chartData = 'cht=r&chxt=y,x&chls=2&chco=FF0000,0000FF&chds=0,1.6&chd=t:' + rates + '&chxl=1:' + titles + '|0:|0|0.4|0.8|1.2|1.6&chm=B,FF000020,0,0,0&chts=000000,20&chtt=Nutritive value&chdl=Real vallue|Target value&chs=500x400';

      return chartData;
    }

    //初期化
    $http.post('/getnutrition', {
      userID: AuthService.get().userID,
      rid: RecipeService.rid()
    }).
    success(function(receiveData, status) {
      $scope.chartData = makeChartData(receiveData);

      chartObs = csbc.observable('chart', {
        send: function(event, data) {
          socket.emit(event, data);
        },
        receive: function(event, setReceived) {
          socket.on(event, function(data) {
            setReceived(data);
          });
        }
      }, ['nutrition', 'rate', 'rateDetail']).addUpdates([function(newValues) {
        $scope.chartData = makeChartData(newValues);
      }]).start(receiveData);
    });

  }]);
})();
