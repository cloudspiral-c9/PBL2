'use strict';

(function() {
    var chart = angular.module('recipeers.recipe.chart', []);

    chart.controller('ChartController', ['$scope', 'socket', '_', 'csbc', '$http', function($scope, socket, _, csbc, $http) {

        var chartObs;

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
                titles += '|' + el.content + '(' + el.rateDetail + ')';
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

        (function getC() {
            $http({
                method: 'get',
                url: '/ingredientsKinds',
                withCredentials: true
            }).
            success(function(receiveData, status) {
                chartObs = csbc.observable('chart', {
                    send: function(event, data) {
                        socket.emit(event, data);
                    },
                    receive: function(event, setReceived) {
                        socket.on(event, function(data) {
                            setReceived(data);
                        });
                    }
                }, ['content', 'rate', 'rateDetail']).start(receiveData, getC()).addUpdates([function(newValues, data){
                  $scope.chartData = makeChartData(newValues);
                }]);
            }).
            error(function(data, status) {
                getC();
            });
        })();

    }]);
})();
