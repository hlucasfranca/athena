'use strict';

/**
 * @ngdoc function
 * @name grapheApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the grapheApp
 */
angular.module('grapheApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
