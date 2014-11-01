'use strict';

(function() {

  var recipe = angular.module('recipeers.recipe');

  recipe.filter('hasKey', [ '_', function(_) {
    return function(input, query) {
      var out;
      if (_.isObject(input) && !_.isFunction(input)) {

        if(_.isArray(input)){
          out = [];
        } else {
          out = {};
        }

        _.each(input, function(value, key) {
          if (input.hasOwnProperty(key) && (String(key).indexOf(query) !== -1 || !_.exists(query))) {
            out[key] = input[key];
          }
        });
        return out;
      }
      return input;
    };
  }]);

  recipe.filter('reverse', ['_', function(_) {
    return function(input, query) {

      var out;

      if (_.isArray(input)) {
        out =  input.slice().reverse();
      } else{
        out =  input;
      }

      return out;
    };
  }]);
})();
