'use strict';

/**
 * @ngdoc directive
 * @name grapheApp.directive:steps
 * @description
 * # steps
 */
angular.module('grapheApp')
  .directive('steps', function () {
    return {
      templateUrl: 'views/steps.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
