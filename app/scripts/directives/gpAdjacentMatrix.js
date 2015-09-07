angular.module('graphe.directives')
    .directive('gpAdjascentMatrix', function () {
        'use strict';
        return {
            templateUrl: 'scripts/directives/gpAdjacentMatrix.html',
            restrict: 'E',
            require: '^gpContainer',
            controller: 'gpAdjacentMatrixCtrl',
            link: function postLink(scope, element, attrs) {

            }
        };
    })
    .controller('gpAdjacentMatrixCtrl', function(){

    });
