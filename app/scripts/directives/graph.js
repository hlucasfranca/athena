'use strict';

/**
 * @ngdoc directive
 * @name grapheApp.directive:graph
 * @description
 * # graph
 */
angular.module('grapheApp')
    .directive('graph', function () {
      return {
        template: '<div></div>',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
          element.text('Graph placeholder');
        }
      };
    });
