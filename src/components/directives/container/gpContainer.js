(function() {
    'use strict';
    angular
        .module('graphe.directives')
        .directive('gpContainer', ['broadcastService', gpContainer])
        .controller('gpContainerCtrl', gpContainerCtrl);

    function gpContainer() {
        return {
            controller: 'gpContainerCtrl',
            restrict: 'A'
        };
    }

    function gpContainerCtrl($rootScope, $scope, $window, $mdDialog, dfs, $interval, model, colors, labels, broadcastService) {
        var vm = this;


        init();

        console.log('gpcontainerctrl init');

        // Sets the default menu option
        $scope.currentOption = $scope.fab.fabOptions.add;
        $scope.isFabOpen = false;
        $scope.selectedColumn = null;
        // The stage dimensions
        $scope.width = 0;
        $scope.height = 0;
        $scope.selectedNode = null;

        $scope.showDialog = showDialog;
        $scope.showNodeEditDialog = showNodeEditDialog;
        $scope.showLinkEditDialog = showLinkEditDialog;
        $scope.setSelectedNode = setSelectedNode;
        $scope.matrix = $scope.graph.getAdjacencyMatrix();
        $scope.adjacencyList = $scope.graph.getAdjacencyMatrix();
        $scope.$watch('scope.graph.getAdjacentMatrix()', updateMatrix);
        $scope.$watch('scope.graph.getAdjacentList()', updateAdjacencyList);
        angular.element($window).on('resize', rescaleGraph());


        // functions
        vm.getCurrentOption = getCurrentOption;
        vm.updateNodeCount = updateNodeCount;
        vm.setSelectedOption = setSelectedOption;
        vm.showNodeEditDialog = $scope.showNodeEditDialog;
        vm.showLinkEditDialog = $scope.showLinkEditDialog;
        vm.setSelectedNode = setSelectedNode;

        rescalePanels();

        // instantiate the graph


        function setSelectedNode(node){
            //console.log(node);
            $scope.selectedNode = node;
        }

        function setSelectedOption(currentAction) {
            //console.log('selected option');
            //console.log(currentAction);
            $scope.fab.currentOption = currentAction;
            //$scope.toggleFab();
            $scope.showContextToolbar();
        }

        function rescalePanels() {
            // get the width of graph-stage element and set to the graph element itself
            var graphStageDiv = $('#gp-stage-container');
            $scope.width = graphStageDiv.width();
            $scope.height= graphStageDiv.height();

            var mdcontent = $('#mdcontent');

            $scope.mdcontent = mdcontent.width() + ',' + mdcontent.height();
        }

        function updateNodeCount (){
            //console.log('updating node count');
            $scope.graph.nodes = $scope.graph.getNodes();
            $scope.graph.links = $scope.graph.getEdges();
        }

        function init(){
            // Creates a simple graph
            $scope.graph = model.getGraph();

            $scope.graph.setDirected(true);

            var numberOfNodes = 3;

            for(var i = 0; i < numberOfNodes; i++) {
                $scope.graph.addNode({
                    index: i,
                    x: Math.random() * 500,
                    y: Math.random() * 500,
                    fixed: true,
                    label: labels.getLetter(),
                    color: d3.rgb(255,255,255),
                    radius: 15
                });
            }

            var numArestas = 3;

            // Connect the nodes with each other
            for(i = 0; i < numArestas; i++){
                for( var j = 0; j < numArestas; j++){
                    if(i !== j) {
                        $scope.graph.addEdge(i,j);
                    }
                }
            }
        }

        function showNodeEditDialog(node, action) {

            //console.log('editing');
            //console.log(node);

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
            }, true);

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }

        function getCurrentOption(){
            return $scope.currentOption;
        }

        function updateMatrix(){
            $scope.matrix = $scope.graph.getAdjacencyMatrix();
            //console.log('matrix changed');
            //console.log($scope.matrix);
        }

        function updateAdjacencyList(){
            $scope.adjacencyList = $scope.graph.getAdjacencyList();
            //console.log('list changed');
            //console.log($scope.adjacencyList);
        }

        function rescaleGraph () {

            //$scope.$apply(function () {
                rescalePanels();
            //});

            var dimensions = {
                width: $scope.width,
                height: $scope.height
            };

            $rootScope.$broadcast('window.resized' , dimensions);
        }
    }

})();