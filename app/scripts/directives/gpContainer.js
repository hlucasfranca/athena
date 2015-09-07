/**
 * @ngdoc directive
 * @name grapheApp.directive:graphContainer
 * @description
 * # graphContainer
 */
angular.module('graphe.directives')
    .directive('gpContainer', function () {
        'use strict';
        return {
            controller: 'gpContainerCtrl',
            restrict: 'A'
        };
    })
    .controller('gpContainerCtrl',function ($scope, $window, dfs, $interval, model, colors, labels) {
        'use strict';

        var numberOfNodes = 5;
        $scope.currentOption = $scope.fabOptions.add;
        $scope.isOpen = false;
        $scope.graphideFab = false;
        $scope.selectedRow = null;
        $scope.selectedColumn = null;
        $scope.stageWidth = 0;
        $scope.stageHeight = 0;

        rescale_panels();

        $scope.graph = model.getGraph(numberOfNodes);
        //var numberOfLinks = Math.floor( Math.random() * numberOfNodes );
        for(var i = 0; i < numberOfNodes; i++){
            for( var j = 0; j < numberOfNodes; j++){
                if(i !== j) {
                    $scope.graph.addEdge(i,j);
                }
            }
        }

        /*$scope.graph = {
            nodes:  $scope.graph.getNodes(),
            links: $scope.graph.getLinks()
        };*/

        // functions
        $scope.checkAdjacent = checkAdjacent;
        $scope.updateNodeCount = updateNodeCount;
        $scope.setSelectedOption = setSelectedOption;
        $scope.selectCell = selectCell;
        $scope.deselectCell = deselectCell;
        $scope.toggleFab = toggleFab;
        // end functions

        $scope.matrix = $scope.graph.getAdjacentMatrix();

        $scope.$watch('scope.graph.getAdjacentMatrix()', function(){
            $scope.matrix = $scope.graph.getAdjacentMatrix();
            console.log($scope.matrix);
        });

        rescale_panels();

        // on window resize, resizes the graph
        angular.element($window).on('resize', function () {
            $scope.$apply(function () {
                rescale_panels();
            });
        });

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
            $scope.isOpen = !$scope.isOpen;
        }

        function checkAdjacent(nodeA, nodeB){
            for(var i = 0; i < $scope.graph.linkList.length; i++){
                if($scope.graph.linkList[i].source.id === nodeA.id && $scope.graph.linkList[i].target.id === nodeB.id){
                    return true;
                }
            }
            return false;
        }

        function rescale_panels() {
            // get the width of graph-stage element and set to the graph element itself
            var graphStageDiv = $('#gp-stage-container');
            $scope.stageWidth = graphStageDiv.width();
            $scope.stageHeight= graphStageDiv.height();
        }

        function updateNodeCount (){
            console.log('updating node count');
            $scope.graph.nodes = $scope.graph.getNodes();
            $scope.graph.links = $scope.graph.getLinks();
        }

    });
