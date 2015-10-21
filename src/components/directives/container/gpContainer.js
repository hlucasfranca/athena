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

        var vm = this;

        var numberOfNodes = 5;
        // Sets the default menu option
        $scope.currentOption = $scope.fab.fabOptions.add;
        $scope.isFabOpen = false;
        $scope.graphideFab = false;
        $scope.selectedRow = null;
        $scope.selectedColumn = null;
        // The stage dimensions
        $scope.width = 0;
        $scope.height = 0;
        $scope.selectedNode = null;

        vm.getCurrentOption = function(){
            return $scope.currentOption;
        };

        rescalePanels();

        // Creates a simple graph
        $scope.graph = model.getGraph();

        for(var i = 0; i < numberOfNodes; i++) {
            $scope.graph.addNode({
                index: i,
                house: 10,
                x: Math.random() * 500,
                y: Math.random() * 500,
                fixed: true,
                label: labels.getLetter()
                });
        }

        // Connect the nodes with each other
        for(i = 0; i < numberOfNodes; i++){
            for( var j = 0; j < numberOfNodes; j++){
                if(i !== j) {
                    $scope.graph.addEdge(i,j);
                }
            }
        }

        // functions
        vm.updateNodeCount = updateNodeCount;
        $scope.setSelectedOption = setSelectedOption;
        $scope.selectCell = selectCell;
        $scope.deselectCell = deselectCell;
        $scope.toggleFab = toggleFab;
        $scope.setSelectedNode = setSelectedNode;
        // end functions

        $scope.matrix = $scope.graph.getAdjacencyMatrix();

        $scope.$watch('scope.graph.getAdjacentMatrix()', function(){
            $scope.matrix = $scope.graph.getAdjacencyMatrix();
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
            $scope.fab.currentOption = currentAction;
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
            $scope.width = graphStageDiv.width();
            $scope.height= graphStageDiv.height();

            $scope.mdcontent = $('#mdcontent').width() + ',' + $('#mdcontent').height();
        }

        function updateNodeCount (){
            console.log('updating node count');
            $scope.graph.nodes = $scope.graph.getNodes();
            $scope.graph.links = $scope.graph.getEdges();
        }

    }

})();