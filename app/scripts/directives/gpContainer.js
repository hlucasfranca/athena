(function() {
    'use strict';
    angular
        .module('graphe.directives')
        .directive('gpContainer', gpContainer)
        .controller('gpContainerCtrl', gpContainerCtrl);

    function gpContainer() {
        return {
            controller: 'gpContainerCtrl',
            restrict: 'A'
        };
    }

    function gpContainerCtrl($scope, $window, dfs, $interval, model, colors, labels) {
        var numberOfNodes = 5;
        // Sets the default menu option
        $scope.currentOption = $scope.fabOptions.add;
        $scope.isFabOpen = false;
        $scope.graphideFab = false;
        $scope.selectedRow = null;
        $scope.selectedColumn = null;
        // The stage dimensions
        $scope.stageWidth = 0;
        $scope.stageHeight = 0;
        $scope.selectedNode = null;

        rescalePanels();

        // Creates a simple graph
        $scope.graph = model.getGraph(numberOfNodes);

        // Connect the nodes with each other
        for(var i = 0; i < numberOfNodes; i++){
            for( var j = 0; j < numberOfNodes; j++){
                if(i !== j) {
                    $scope.graph.addEdge(i,j);
                }
            }
        }

        // functions
        $scope.updateNodeCount = updateNodeCount;
        $scope.setSelectedOption = setSelectedOption;
        $scope.selectCell = selectCell;
        $scope.deselectCell = deselectCell;
        $scope.toggleFab = toggleFab;
        $scope.setSelectedNode = setSelectedNode;
        // end functions

        $scope.matrix = $scope.graph.getAdjacentMatrix();

        $scope.$watch('scope.graph.getAdjacentMatrix()', function(){
            $scope.matrix = $scope.graph.getAdjacentMatrix();
            console.log('matrix changed');
            console.log($scope.matrix);
        });

        rescalePanels();

        // on window resize, resizes the graph
        angular.element($window).on('resize', function () {
            $scope.$apply(function () {
                rescalePanels();
            });
        });

        function setSelectedNode(node){
            $scope.selectedNode = node;
        }

        function setSelectedOption(currentAction) {
            $scope.setCurrentOption(currentAction);
            $scope.toggleFab();
            $scope.showContextToolbar();
            //$scope.graphideFab = true;
        }

        function selectCell(row, column){
            $scope.selectedRow = row;
            $scope.selectedColumn = column;
        }

        function deselectCell() {
            $scope.selectedRow = null;
            $scope.selectedColumn = null;
        }

        function toggleFab () {
            $scope.isFabOpen = !$scope.isFabOpen;
        }

        function rescalePanels() {
            // get the width of graph-stage element and set to the graph element itself
            var graphStageDiv = $('#gp-stage-container');
            $scope.stageWidth = graphStageDiv.width();
            $scope.stageHeight= graphStageDiv.height();
        }

        function updateNodeCount (){
            console.log('updating node count');
            $scope.graph.nodes = $scope.graph.getNodes();
            $scope.graph.links = $scope.graph.getEdges();
        }

    }

})();