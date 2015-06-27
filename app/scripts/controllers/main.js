'use strict';

/**
 * @ngdoc function
 * @name grapheApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the grapheApp
 */
angular.module('grapheApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
