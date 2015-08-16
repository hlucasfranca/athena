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

            $scope.showHelp = function(){
                $scope.showSimpleToast($scope.currentOption.message);
            };

            $scope.setMessage = function(message){
                $scope.message = message;
            };

            $scope.hasMessages = function(){
                return $scope.message !== null && $scope.message !== undefined && $scope.message !== '';
            };

            $scope.isShowContextToolbar = false;

            $scope.showContextToolbar = function(){
              $scope.isShowContextToolbar = true;
            };

            $scope.hideContextToolbar = function(){
                $scope.isShowContextToolbar = false;
                $scope.hideFab = false;
            };

            $scope.setCurrentOption = function(option) {
                $scope.currentOption = option;
            };

            $scope.getCurrentOption = function(){
                return $scope.currentOption;
            };


            $scope.toastPosition = {
                bottom: true,
                top: false,
                left: false,
                right: true
            };





            $scope.fabOptions = {
                add: {
                    name: 'Add',
                    icon: 'add',
                    message: 'Click anywhere on the stage to add a node.',
                    enabled: true,
                    color: '#4CAF50',
                    contextOptions:[
                        {
                            name: 'Add Node',
                            icon: 'add_circle',
                            message: 'Click anywhere to add a node.'
                        },
                        {
                            name: 'Add Link',
                            icon: 'settings_ethernet',
                            message: 'Select a node to connect to another.',
                            enabled: true,
                            color: '#4CAF50'

                        }
                    ]
                },
                remove : {
                    name: 'Remove',
                    icon: 'clear',
                    message:'Click on a node or link to remove.',
                    enabled: true,
                    color: '#F44336'
                },
                select: {
                    name: 'Select',
                    icon: 'check',
                    message: 'Click on a node or link to select.',
                    enabled: true,
                    color: '#FF9800',
                    contextOptions:[
                        {
                            name: 'Select',
                            icon: 'select_all',
                            message: 'Select all.'
                        }
                    ]

                },
                info: {
                    name: 'Information',
                    icon: 'info',
                    message: 'Click on a node or link for information, click on stage to global information.',
                    enabled: true,
                    color: '#2196F3'
                }
            };

            $scope.showSimpleToast = function (message) {

                if ($mdToast !== undefined) {
                    console.log('toast');
                    $mdToast.show(
                        $mdToast.simple()
                            .content(message)
                            .action('Got it.')
                            .highlightAction(false)
                            .position($scope.getToastPosition())
                            .hideDelay(3000))
                                .then(function(){
                                    console.log('got it.');
                                });
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

            $scope.cancel = function () {
                $scope.hideContextToolbar();
                $scope.setMessage(null);
                $scope.setCurrentOption({});

            };

        }]);
