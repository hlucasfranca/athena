(function () {
    'use strict';
    angular.module('graphe')
        .controller('MainCtrl', ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$location',
            'fab', 'broadcastService', 'toast',
            function ($scope, $mdSidenav, $mdToast, $mdDialog, $location, fab, broadcastService, toast) {

                $scope.appName = "Athena";


                $scope.menuOptions = [
                    {label: 'Página inicial', link: '/'},
                    {label: 'Novo grafo', link: '/graph'},
                    {label: 'Sobre', link: '/about'}
                ];

                $scope.isShowContextToolbar = false;
                $scope.fab = fab;
                $scope.showFab = true;

                // Functions
                $scope.showHelp = showHelp;

                $scope.showContextToolbar = showContextToolbar;
                $scope.hideContextToolbar = hideContextToolbar;
                $scope.toggleSidenav = toggleSidenav;
                $scope.go = go;
                $scope.cancel = cancel;
                $scope.message = '';

                $scope.$on('new_message',function(){

                    $scope.message = broadcastService.object;

                    console.log(broadcastService);

                    console.log('received');

                });

                // Function definitions
                function showHelp() {
                    toast.showSimpleToast($scope.fab.currentOption.message);
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
                    $scope.message = '';
                    $scope.fab.currentOption = {};
                    $scope.showFab = true;
                }
            }]);
})();