'use strict';

(function() {
  var recipe = angular.module('recipeers.recipe');

  recipe.service('RecipeService', [ '$http', 'socket', '_', 'csbc', 'RecipeListService', 'AuthService', '$location', function( $http, socket, _, csbc, RecipeListService, AuthService, $location) {

    var rid = null;

    function update(newValues, data) {

      var rrid;

      _.each(newValues, function(value, i, list) {
        if (_.isEqual(value.rid, rid)) {
          _.each(value.members, function(member, i, list) {
            if (_.isEqual(member.userID, AuthService.get().userID)) {
              rrid = value.rid;
            }
          });
        }
      });
      if (rrid && (rrid !== rid)) {
        rid = rrid;
        $location.path("/recipe/" + rid);
      } else if (!rrid) {
        if (!_.isNull(rid)) {
          rid = null;
          $location.path("/");
        } else {
          rid = null;
        }
      }

    }

    if (_.truthy(RecipeListService.obs())) {
      RecipeListService.obs().addUpdates([update]);
    } else {
      RecipeListService.addUpdates(update);
    }

    return {
      rid: function() {
        return rid;
      },
      setRid: function(srid) {
        rid = srid;
      }
    };

  }]);

})();
