'use strict';

(function() {
    var recipelist = angular.module('recipeers.recipelist');

    recipelist.filter('hasValue', function() {
        return function(input, query) {
            var out = {};
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    for (var key2 in input[key]) {
                        if (input[key].hasOwnProperty(key2) && (String(input[key][key2]).indexOf(query) !== -1 || !query)) {
                            out[key] = input[key];
                        }
                    }
                }
            }
            return out;
        };
    });

})();
