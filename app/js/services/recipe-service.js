'use strict';

(function () {

  var recipe = angular.module('recipeers.recipe', [
    'recipeers.recipe.ingredients',
    'recipeers.recipe.processes',
    'recipeers.recipe.chats',
    'recipeers.recipe.chart',
  ]);

  recipe.factory('RecipeService', ['$routeParams', '$http', 'socket', '_', function ($routeParams, $http, socket, _) {

    var data, selectData, updateRecipeCurry;

    selectData = function (data, attr) {
      var regexp, attrArray, selectedData, len;

      attr = attr || '';

      //regexp = /(.+)((?:\.).+)*/;
      regexp = /[^.]+(?=$|\.)/g;
      attrArray = attr.match(regexp) || [];

      selectedData = data;

      len = attrArray.length;

      if (len === 0) {
        return data;
      }

      for (var i = 0; i < len - 1; i++) {
        if (selectedData[attrArray[i]]) {
          selectedData = selectedData[attrArray[i]];
        }
      }

      return {
        obj: selectedData,
        prop: attrArray[attrArray.length - 1]
      };
    };

    updateRecipeCurry = function (attr) {
      var select;
      select = selectData(data, attr);

      return function (newData) {
        if (newData.mode === 'delete') {
          if (select.prop) {
            if (_.isArray(select.obj[select.prop])) {
              select.obj[select.prop].splice(newData.index, 1);
            } else {
              delete select.obj[select.prop][newData.index];
            }
          } else {
            if (_.isArray(data)) {
              data.splice(newData.index, 1);
            } else {
              delete data[newData.index];
            }
          }
        } else {
          if (select.prop) {
            if (_.isArray(select.obj[select.prop]) && newData.mode === 'add') {
              select.obj[select.prop].splice(newData.index + 1, 0, newData.value);
            } else {
              select.obj[select.prop][newData.index] = newData.value;
            }
          } else {
            data[newData.index] = newData.value;
          }
        }
      };
    };

    data = socket.getRecipeData();
    /*
    $http({
      method: 'get',
      url: '/recipe/' + $routeParams.recipeId,
      withCredentials: true
    }).
    success(function (receiveData, status) {
      data = receiveData;
    }).
    error(function (data, status) {
      alert('RecipeGetError');
    });*/

    return {
      data: data,
      updateRecipeCurry: updateRecipeCurry
    };

  }]);

  recipe.filter('hasKey', function () {
    return function (input, query) {
      var out = {};
      for (var key in input) {
        if (input.hasOwnProperty(key) && (key.toString().indexOf(query) !== -1 || !query)) {
          out[key] = input[key];
        }
      }
      return out;
    };
  });

  recipe.filter('reverse', function () {
    return function (input, query) {
      return input.slice().reverse();
    };
  });
})();

/*
 
  (function () {

    var recipe = angular.module('recipeers.recipe', [
      'recipeers.recipe.ingredients',
      'recipeers.recipe.processes',
      'recipeers.recipe.chart',
      'recipeers.recipe.chat'
    ]);

    recipe.factory('RecipeService', ['$scope', '$routeParams', '$http', 'socket', function ($scope, $routeParams, $http, socket) {

      var data, localData, selectData, cloneData, cloneRecipeCurry, sendRecipeCurry, updateRecipeCurry, receiveRecipeCurry, update;

      cloneData = function (clone, original) {
        clone = jQuery.extend(true, {}, original);
      };

      selectData = function (data, attr) {
        var regexp, attrArray, selectedData, l, prop;
*/
//       regexp = /(.+)((?:\.).+)*/;
/*      attrArray = attr.match(regexp);

      selectedData = data;

      l = attrArray.length;

      if (l === 0) {
        return data;
      }

      for (var i = 0; i < l - 1; i++) {
        if (selectedData[attrArray[i]]) {
          selectedData = selectedData[attrArray[i]];
        }
      }

      return {
        obj: selectedData,
        prop: attrArray[attrArray.length - 1]
      };
    };

    cloneRecipeCurry = function (attr) {
      var select, localSelect;
      select = selectData(data, attr);
      localSelect = selectData(localData, attr);

      return function () {
        if (select.prop && localSelect) {
          cloneData(localSelect.obj[localSelect.prop], select.obj[select.prop]);
        } else if (!select.prop && !localSelect) {
          cloneData(localData, data);
        } else {
          alert('RecipeDataError');
        }
      };
    };

    updateRecipeCurry = function (attr) {
      var select, localSelect;
      select = selectData(data, attr);

      return function (newData) {
        if (select.prop) {
          select.obj[select.prop] = newData;
        } else {
          data = newData;
        }
      };
    };

    sendRecipeCurry = function (event, attr, callback) {
      var select = selectData(data, attr);
      return function () {
        if (select.prop) {
          socket.emit(event, select.obj[select.prop], callback);
        } else {
          socket.emit(event, data, callback);
        }
      };
    };

    receiveRecipeCurry = function (event, attr, callback) {
      var select = selectData(data, attr);
      return function () {
        if (select.prop) {
          socket.on(event, function (newData) {
            callback.call(this, newData, select.obj[select.prop]);
          });
        } else {
          socket.on(event, function (newData) {
            callback.call(this, newData, data);
          });
        }
      };
    };

    update = function (newData) {
      (updateRecipeCurry()(newData));
      (cloneRecipeCurry()());
    };

    $http({
      method: 'get',
      url: '/recipe/' + $routeParams.recipeId,
      withCredentials: true
    }).
    success(function (data, status) {
      update(data);
    }).
    error(function (data, status) {
      alert('RecipeGetError');
    });

    return {
      data: data,
      localData: localData,
      cloneRecipeCurry: cloneRecipeCurry,
      updateRecipeCurry: updateRecipeCurry,
      sendRecipeCurry: sendRecipeCurry,
      receiveRecipeCurry: receiveRecipeCurry
    };

  }]);

})();*/
