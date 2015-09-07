angular.module('graphe.directives')
    .directive('gpInfo', function () {
        'use strict';
        return {
            templateUrl: 'scripts/directives/gpInfo.html',
            restrict: 'E',
            require: '^gpContainer',
            link: function postLink(scope, element, attrs) {

            }
        };
    });
