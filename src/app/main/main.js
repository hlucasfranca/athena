(function () {
    'use strict';
    angular.module('graphe')
        .controller('MainCtrl', ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$location', 'fab',
            function ($scope, $mdSidenav, $mdToast, $mdDialog, $location, fab) {

                $scope.appName = "[ Nome do projeto ]";

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
                //$scope.showSimpleToast = showSimpleToast;
                //$scope.getToastPosition = getToastPosition;
                $scope.toggleSidenav = toggleSidenav;
                $scope.go = go;
                $scope.cancel = cancel;


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

                function toggleSidenav(menuId) {
                    $mdSidenav(menuId).toggle();
                }

                /**
                 * Executa a mudança de página
                 * @param url
                 * @param hideNavigationBar
                 */
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

            }]);
})();