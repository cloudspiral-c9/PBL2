'use strict';

(function () {
  var chart = angular.module('recipeers.recipe.chart', []);

  chart.controller('ChartController', ['$scope', 'socket', '_', 'RecipeService', function ($scope, socket, _, recipe) {

    function makeChartData(chart){

      var chartData,rates,titles,allOne,firstRate;

      rates = '';
      titles = '';
      allOne = '';



      _.each(chart, function(el){
        if(!firstRate){
          firstRate = el.rate + ',';
        }
        rates += el.rate + ',';
        titles  += '|' + el.content + '(' +el.rateDetail + ')';
        allOne += '1,';
      });

      rates += firstRate;
      allOne += '1,';
      rates = rates.slice(0,-1);
      allOne = allOne.slice(0,-1);

      rates = rates + '|' + allOne;
      chartData = 'cht=r&chxt=y,x&chls=2&chco=FF0000,0000FF&chds=0,1.6&chd=t:'+ rates + '&chxl=1:'+ titles +'|0:|0|0.4|0.8|1.2|1.6&chm=B,FF000020,0,0,0&chts=000000,20&chtt=Nutritive value&chdl=Real vallue|Target value&chs=500x400';

/*
      chartData = 'cht=r' +
      '&amp;chxt=y,x' +
      '&amp;chls=2|2' +
      '&amp;chco=FF0000,00FF00' +
      '&amp;chxp=0,0.4,0.8,1.2,1.6,2.0&amp;' +
      'chd=t:'+ rates + 
      '&amp;chxl=1:'+ titles +
      '&amp;chm=s,FF0000,0,-1,12,0|s,FFFFFF,0,-1,8,0|o,00FF00,1,-1,12,0|o,FFFFFF,1,-1,8,0' +
      '&amp;chts=000000,20' +
      '&amp;chtt=Nutritive value' +
      '&amp;chdl=Target vallue|Real value&amp;' +
      'chs=400x400';*/

     /* var src = &quot;http://chart.apis.google.com/chart&quot;
        + &quot;?cht=r&quot;
        + &quot;&amp;chxt=y,x&quot;
        + &quot;&amp;chls=4|4&quot;
        + &quot;&amp;chco=FF0000,00FF00&quot;
        + &quot;&amp;chxp=0,0,20,40,60,80,100&quot;
        + &quot;&amp;chd=t:&quot;
        + a + &quot;|&quot; + b
        + &quot;&amp;chxl=1:&quot; + n
        + &quot;&amp;chm=s,FF0000,0,-1,12,0|s,FFFFFF,0,-1,8,0|o,00FF00,1,-1,12,0|o,FFFFFF,1,-1,8,0&quot;
        + &quot;&amp;chts=000000,20&quot;
        + &quot;&amp;chtt=&quot; + $('#title').val()
        + &quot;&amp;chdl=データA|データB&quot;
        + &quot;&amp;chs=320x320&quot;   */      

        return chartData;
    }

    $scope.chartData = makeChartData(recipe.data.chart);

/*
    $scope.chartData = 'cht=r&chxt=y,x&chls=4|4&chco=FF0000,00FF00&chxp=0,0,20,40,60,80,100&chd=t:76,78,91,78,58,72,76|55,65,59,77,87,45,55&chxl=1:|項目(1)|項目(2)|項目(3)|項目(4)|項目(5)|項目(6)&chm=s,FF0000,0,-1,12,0|s,FFFFFF,0,-1,8,0|o,00FF00,1,-1,12,0|o,FFFFFF,1,-1,8,0&chts=000000,20&chtt=Nutritive value&chdl=データA|データB&chs=320x320';*/
    
    socket.on('receiveChart', function (newData) {
      recipe.updateRecipeCurry()(newData);
      $scope.chartData = makeChartData(newData.value);
    });
  }]);
})();
