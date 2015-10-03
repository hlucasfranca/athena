/*
* gpAdjascentList
* 
* Directive to display the adjacency list.
*
* */
angular.module('graphe.directives')
    .directive('gpAdjascentList', function () {
        'use strict';
        return {
            templateUrl: 'scripts/directives/gpAdjacentList.html',
            restrict: 'E',
            require: '^gpContainer',
            link: function postLink(scope, element, attrs) {

            }
        };
    });
