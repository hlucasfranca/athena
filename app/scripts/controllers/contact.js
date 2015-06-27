'use strict';

/**
 * @ngdoc function
 * @name grapheApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the grapheApp
 */
angular.module('grapheApp')
    .controller('ContactCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.email = '';
    });
