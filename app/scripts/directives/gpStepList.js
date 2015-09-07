/**
 * @ngdoc directive
 * @name app.directive:steps
 * @description
 * # steps
 */
angular.module('graphe')
    .directive('gpStepList', function () {
        'use strict';
        return {
            templateUrl: 'scripts/directives/gpStepList.html',
            restrict: 'E',
            require: '^gpAlgorithmPlayer',
            link: function postLink(scope, element, attrs, gpStageCtrl) {

            }
        };
    });
