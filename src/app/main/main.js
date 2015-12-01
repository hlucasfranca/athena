(function () {
    'use strict';
    angular.module('graphe')
        .controller('MainCtrl', [
                      '$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$location', 'fab', 'broadcastService', 'toast',
            function ( $scope,   $mdSidenav,   $mdToast,   $mdDialog,   $location,   fab,   broadcastService,   toast) {

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

                $scope.showDialog = showDialog;
                $scope.showNodeEditDialog = showNodeEditDialog;
                $scope.showLinkEditDialog = showLinkEditDialog;
                $scope.showNewGraphDialog = showNewGraphDialog;

                // nova mensagem de contexto
                $scope.$on('new_message',function(){
                    $scope.message = broadcastService.object;
                });


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
                 * @param url destino
                 * @param hide ocultar menu lateral
                 */
                function go(url, hide) {

                    if($location.path() === "/graph" && url === "/graph"){
                        console.log('novo grafo');
                    }

                    $location.path(url);

                    if (hide) {
                        $scope.toggleSidenav('left');
                    }
                }

                function cancel() {
                    $scope.hideContextToolbar();
                    $scope.message = '';
                    $scope.fab.currentOption = {};
                    $scope.showFab = true;
                }


                function showNodeEditDialog(node, action) {

                    $scope.selectedNode = node;

                    $mdDialog.show({
                        controller: NodeEditDialogController,
                        // use parent scope
                        scope: $scope,
                        preserveScope: true,
                        templateUrl: '../../components/directives/container/nodeEditDialog.tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: true
                    }).then(
                        // on sucess
                        function () { action(); },
                        // on error
                        function () {}
                    );
                }

                //TODO: atualizar apenas quando der ok?
                function NodeEditDialogController($scope, $mdDialog) {

                    $scope.color = $scope.selectedNode.color || d3.rgb(255,255,255);
                    $scope.label = $scope.selectedNode.label || 'Rótulo';

                    $scope.$watch($scope.selectedNode, function(){
                        broadcastService.broadcast('update_stage');
                    }, true);

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.answer = function (answer) {
                        //console.log('node edit complete');
                        $mdDialog.hide(answer);
                    };
                }


                /**
                 * Dialogo de selecao de nó para execucao de algoritmo
                 * @param action
                 */
                function showDialog(action) {

                    $mdDialog.show({
                        controller: DialogController,
                        // use parent scope
                        scope: $scope,
                        preserveScope: true,
                        templateUrl: '../../components/directives/container/selectNodeDialog.tpl.html',
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

                    $scope.hide = function () { $mdDialog.hide(); };

                    $scope.cancel = function () { $mdDialog.cancel(); };

                    $scope.answer = function (answer) { $mdDialog.hide(answer);};
                }


                /**
                 *  Diálogo de edição de arestas
                 */
                function showLinkEditDialog(link, action) {

                    $scope.selectedLink = link;

                    $mdDialog.show({
                        controller: LinkEditDialogController,
                        // use parent scope
                        scope: $scope,
                        preserveScope: true,
                        templateUrl: '../../components/directives/container/linkEditDialog.tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: true
                    }).then(
                        // on sucess
                        function () { action(); },
                        // on error
                        function () {}
                    );
                }

                function LinkEditDialogController($scope, $mdDialog) {



                    $scope.selectedLink.peso = $scope.selectedLink.peso || 1;


                    $scope.$watch($scope.selectedLink, function(){
                        broadcastService.broadcast('update_stage');
                        broadcastService.broadcast('update_matrix');
                    }, true);

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                }

                /**
                 *  Diálogo de edição de arestas
                 */
                function showNewGraphDialog(link, action) {

                    $scope.selectedLink = link;

                    $mdDialog.show({
                        controller: NewGraphDialogController,
                        // use parent scope
                        scope: $scope,
                        preserveScope: true,
                        templateUrl: '../../components/directives/container/newGraphDialog.tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: true
                    }).then(
                        // on sucess
                        function () { action(); },
                        // on error
                        function () {}
                    );
                }

                function NewGraphDialogController($scope, $mdDialog) {

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                }
            }]);
})();