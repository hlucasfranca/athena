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

        var numberOfNodes = 4 + Math.floor(Math.random() * 12);

        $scope.h = GraphService.getGraph(numberOfNodes);

        var numberOfLinks = Math.floor( Math.random() * numberOfNodes );

        for(var i = 0; i < numberOfNodes; i++){

            var dest = Math.floor( Math.random() * numberOfNodes );
            $scope.h.addEdge(i,dest);

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
                .duration(750)
                .ease('elastic')
                .attr('r', 50);

            console.log(id);
        };

        $scope.deselectNode = function (id){
            d3.select('#node-' + id + ' circle')
                .transition()
                .duration(100)
                .ease('linear')
                .attr('r', 15);

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
    });
