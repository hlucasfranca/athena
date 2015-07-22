'use strict';

/**
 * @ngdoc function
 * @name grapheApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the grapheApp
 */


angular.module('grapheApp')
    .controller('MainCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav, $mdToast, $animate){

        $scope.toastPosition = {
            bottom: true,
            top: false,
            left: false,
            right: true
        };

        $scope.showSimpleToast = function() {
            if($mdToast !== undefined){
            $mdToast.show(
                $mdToast.simple()
                    .content('Basic Toast!')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
            }
        };

        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };

        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        $scope.menuOptions = [
            {label: 'New Graph', link:'#/graph'},
            {label: 'Help', link:'#/about'}
        ];


        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

    }]);
