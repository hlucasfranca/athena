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

        $scope.h = GraphService.getGraph(5);

        $scope.h.addEdge(0,1);
        $scope.h.addEdge(1,2);
        $scope.h.addEdge(2,3);
        $scope.h.addEdge(3,4);
        $scope.h.addEdge(4,0);
        $scope.h.addEdge(0,3);
        $scope.h.addEdge(4,2);

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
            $scope.width = $('#graphStageDiv').width();
            $scope.height = $('#graphStageDiv').height();
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
