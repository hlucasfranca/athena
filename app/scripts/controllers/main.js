'use strict';

/**
 * @ngdoc function
 * @name grapheApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the grapheApp
 */

angular.module('grapheApp')
    .controller('MainCtrl', ['$scope', '$mdSidenav', '$mdToast', '$location',
        function ($scope, $mdSidenav, $mdToast, $location) {

            $scope.toastPosition = {
                bottom: true,
                top: false,
                left: false,
                right: true
            };

            $scope.fabOptions = {
                add: {
                    name: "Add",
                    icon: 'add',
                    message: 'Click anywhere on the stage to add a node.',
                    enabled: true
                },
                remove : {
                    name: "Remove",
                    icon: 'clear',
                    message:'Click on a node or link to remove.',
                    enabled: true
                },
                select: {
                    name: "Select",
                    icon: 'check',
                    message: 'Click on a node or link to select.',
                    enabled: true
                },
                info: {
                    name: 'Information',
                    icon: 'info',
                    message: 'Click on a node or link for information, click on stage to global information.',
                    enabled: true
                }
            };

            $scope.showSimpleToast = function (message) {
                if ($mdToast !== undefined) {
                    console.log('toast');
                    $mdToast.show(
                        $mdToast.simple()
                            .content(message)
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                    );
                }
            };

            $scope.getToastPosition = function () {
                return Object.keys($scope.toastPosition)
                    .filter(function (pos) {
                        return $scope.toastPosition[pos];
                    })
                    .join(' ');
            };

            $scope.toggleSidenav = function (menuId) {
                $mdSidenav(menuId).toggle();
            };

            $scope.menuOptions = [
                {label: 'Home', link: '/'},
                {label: 'New Graph', link: '/graph'},
                {label: 'Help', link: '/about'}
            ];

            $scope.go = function (url, hideNavigationBar) {
                $location.path(url);

                if(hideNavigationBar)
                    $scope.toggleSidenav('left');


                console.log(url);
            };

            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

        }]);
