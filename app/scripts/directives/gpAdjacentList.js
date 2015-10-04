(function () {
    'use strict';
    /*
     * gpAdjascentList
     *
     * Directive to display the adjacency list.
     *
     * */
    angular.module('graphe.directives')
        .directive('gpAdjascentList', function () {
            return {
                templateUrl: 'scripts/directives/gpAdjacentList.html',
                restrict: 'E',
                require: '^gpContainer',
                link: function postLink(scope, element, attrs) {
                }
            };
        });
})();