(function () {
    'use strict';
    angular.module('graphe')
        .controller('MainCtrl', ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$location', 'fab',
            function ($scope, $mdSidenav, $mdToast, $mdDialog, $location, fab) {

                //$scope.options = ['a', 'b', 'c'];
                //
                //$scope.setOptions = function (options) {
                //    $scope.options = options;
                //};

                //$scope.selectedOption = ;

                $scope.awesomeThings = [
                    'HTML5 Boilerplate',
                    'AngularJS',
                    'Karma'
                ];
                $scope.toastPosition = {
                    bottom: true,
                    top: false,
                    left: false,
                    right: true
                };

                $scope.menuOptions = [
                    {label: 'Home', link: '/'},
                    {label: 'New Graph', link: '/graph'},
                    {label: 'Help', link: '/about'}
                ];

                $scope.isShowContextToolbar = false;
                //$scope.fabOptions = fab.fabOptions;
                $scope.fab = fab;

                // Functions
                $scope.showHelp = showHelp;
                $scope.setMessage = setMessage;
                $scope.hasMessages = hasMessages;
                $scope.showContextToolbar = showContextToolbar;
                $scope.hideContextToolbar = hideContextToolbar;
                $scope.showSimpleToast = showSimpleToast;
                $scope.getToastPosition = getToastPosition;
                $scope.toggleSidenav = toggleSidenav;
                $scope.go = go;
                $scope.cancel = cancel;
                $scope.showDialog = showDialog;

                // Function definitions
                function showHelp() {
                    $scope.showSimpleToast($scope.currentOption.message);
                }

                function setMessage(message) {
                    $scope.message = message;
                }

                function hasMessages() {
                    return $scope.message !== null && $scope.message !== undefined && $scope.message !== '';
                }

                function showContextToolbar() {
                    $scope.isShowContextToolbar = true;
                }

                function hideContextToolbar() {
                    $scope.isShowContextToolbar = false;
                    $scope.hideFab = false;
                }

                function showSimpleToast(message) {

                    if ($mdToast !== undefined) {
                        console.log('toast');
                        $mdToast.show(
                            $mdToast.simple()
                                .content(message)
                                .action('Got it.')
                                .highlightAction(false)
                                .position($scope.getToastPosition())
                                .hideDelay(3000))
                            .then(function () {
                                console.log('got it.');
                            });
                    }
                }

                function getToastPosition() {
                    return Object.keys($scope.toastPosition)
                        .filter(function (pos) {
                            return $scope.toastPosition[pos];
                        })
                        .join(' ');
                }

                function toggleSidenav(menuId) {
                    $mdSidenav(menuId).toggle();
                }

                function go(url, hideNavigationBar) {
                    $location.path(url);

                    if (hideNavigationBar) {
                        $scope.toggleSidenav('left');
                    }
                    console.log('going to: ' + url);
                }

                function cancel() {
                    $scope.hideContextToolbar();
                    $scope.setMessage(null);
                    $scope.fab.currentOption = {};
                }

                function showDialog(action) {

                    $mdDialog.show({
                        controller: DialogController,
                        // use parent scope
                        scope: $scope,
                        preserveScope: true,
                        templateUrl: '../../components/directives/selectNodeDialog.tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: true
                    })
                        .then(
                        // on sucess
                        function () {
                            action($scope.selectedNode);
                        },
                        // on error
                        function () {
                            $scope.status = 'You cancelled the dialog.';
                        });
                }

                function DialogController($scope, $mdDialog) {

                    console.log($scope.options);

                    $scope.answer = 'A';

                    $scope.hide = function () {
                        console.log('hide');
                        $mdDialog.hide();
                    };

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                }

            }]);
})();