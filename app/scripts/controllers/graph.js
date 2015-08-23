/**
 * @ngdoc function
 * @name grapheApp.controller:GraphCtrl
 * @description
 * # GraphCtrl
 * Controller of the grapheApp
 */
angular.module('grapheApp')
    .controller('GraphCtrl', function ($scope, $window, GraphService) {
        'use strict';

        var numberOfNodes = 5;

        $scope.h = GraphService.getGraph(numberOfNodes);

        //var numberOfLinks = Math.floor( Math.random() * numberOfNodes );

        for(var i = 0; i < numberOfNodes; i++){

            for( var j = 0; j < numberOfNodes; j++){
                if(i !== j) {
                    $scope.h.addEdge(i,j);
                }
            }


        }

        $scope.graph = {
            nodes:  $scope.h.getNodes(),
            links: $scope.h.getLinks()
        };

        $scope.updateNodeCount = function(){
            console.log('updating node count');
            $scope.graph.nodes = $scope.h.getNodes();
            $scope.graph.links = $scope.h.getLinks();
        };

        $scope.matrix = $scope.h.getAdjacentMatrix();

        $scope.$watch('scope.h.getAdjacentMatrix()', function(){
            $scope.matrix = $scope.h.getAdjacentMatrix();
            console.log($scope.matrix);
        });

        $scope.selectNode = function (id){
            d3.select('#node-' + id + ' circle')
                .transition()
                .duration(250)
                .ease('linear')
                .style('fill', '#000000')
                .attr('r', 20);

            d3.select('#node-' + id + ' text')
                .transition()
                .duration(250)
                .ease('linear')
                .style('fill', '#ffffff');

            console.log(id);
        };

        $scope.deselectNode = function (id){
            d3.select('#node-' + id + ' circle')
                .transition()
                .duration(250)
                .ease('linear')
                .style('fill', '#ffffff')
                .attr('r', 15);

            d3.select('#node-' + id + ' text')
                .transition()
                .duration(250)
                .ease('linear')
                .style('fill', '#000000');

            console.log('deselected:' + id);
        };

        $scope.checkAdjacent = function(nodeA, nodeB){

            for(var i = 0; i < $scope.h.linkList.length; i++){
                if($scope.h.linkList[i].source.id === nodeA.id && $scope.h.linkList[i].target.id === nodeB.id){
                    return true;
                }
            }
            return false;
        };

        $scope.currentOption = $scope.fabOptions.add;
        $scope.isOpen = false;
        $scope.hideFab = false;



        $scope.setSelectedOption = function (currentAction) {
            $scope.setCurrentOption(currentAction);
            $scope.toggleFab();
            $scope.showContextToolbar();
            //$scope.hideFab = true;
        };

        $scope.selectedRow = null;
        $scope.selectedColumn = null;

        $scope.selectCell = function(row, column){

            $scope.selectedRow = row;
            $scope.selectedColumn = column;

        };

        $scope.deselectCell = function(){
            $scope.selectedRow = null;
            $scope.selectedColumn = null;
        };

        $scope.toggleFab = function () {
            $scope.isOpen = !$scope.isOpen;
        };

        function rescale_panels() {
            // get the width of graph-stage element and set to the graph element itself
            var graphStageDiv = $('#graphStageDiv');
            $scope.width = graphStageDiv.width();
            $scope.height = graphStageDiv.height();
        }

        rescale_panels();

        // on window resize, resizes the graph
        angular.element($window).on('resize', function () {
            $scope.$apply(function () {
                rescale_panels();
            });
        });

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        // TODO: replace by node itself, remove the 'marked' array

        $scope.depthInstructions = [
            'procedure DFS(G,v):',
            'label v as discovered',
            'for all edges from v to w in G.adjacentEdges(v) do',
            'if vertex w is not labeled as discovered then',
            'recursively call DFS(G,w)',
            'end of algorithm'
        ];

        var currentInstruction = 0;

        /*
         A recursive implementation of DFS (Cormen)

         1  procedure DFS(G,v):
         2      label v as discovered
         3      for all edges from v to w in G.adjacentEdges(v) do
         4          if vertex w is not labeled as discovered then
         5              recursively call DFS(G,w)

         */
        $scope.steps = [];

        $scope.selectedStep = -1;

        $scope.selectStep = function(step){
            $scope.selectedStep = step;
        };

        $scope.runAlg = function(){
            $scope.steps = [];
            $scope.depthFirstSearch($scope.h.getNodes()[0]);
            console.log($scope.steps);
            $scope.steps.push({ instruction: 5 });
        };

        // FIXME: recursive execution order
        // TODO: move to a service (algorithm service), dfs(G,v)
        $scope.depthFirstSearch = function (visited) {

            $scope.steps.push({ instruction: 0, visited: visited });

            visited.marked = true;

            $scope.steps.push({ instruction: 1, visited: visited });

            $scope.h.adjacentList[visited.index].forEach(function(node){
                $scope.steps.push({ instruction: 2, visited: visited });
                $scope.steps.push({ instruction: 3, visited: visited });

                console.log(visited.index);

                if (!node.marked) {
                    $scope.steps.push({ instruction: 4, visited: visited });
                    $scope.depthFirstSearch(node);
                }
            });

        };
    });
