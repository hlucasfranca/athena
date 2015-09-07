/**
 * @ngdoc function
 * @name grapheApp.controller:GraphCtrl
 * @description
 * # GraphCtrl
 * Controller of the grapheApp
 */
angular.module('graphe')
    .controller('GraphCtrl', function ($scope, $window, GraphService, algorithmService, $interval) {
        'use strict';

        //var numberOfNodes = 5;
        //
        //$scope.h = GraphService.getGraph(numberOfNodes);
        //
        ////var numberOfLinks = Math.floor( Math.random() * numberOfNodes );
        //
        //for(var i = 0; i < numberOfNodes; i++){
        //
        //    for( var j = 0; j < numberOfNodes; j++){
        //        if(i !== j) {
        //            $scope.h.addEdge(i,j);
        //        }
        //    }
        //}
        //
        //$scope.graph = {
        //    nodes:  $scope.h.getNodes(),
        //    links: $scope.h.getLinks()
        //};
        //
        //$scope.updateNodeCount = function(){
        //    console.log('updating node count');
        //    $scope.graph.nodes = $scope.h.getNodes();
        //    $scope.graph.links = $scope.h.getLinks();
        //};
        //
        //$scope.matrix = $scope.h.getAdjacentMatrix();
        //
        //$scope.$watch('scope.h.getAdjacentMatrix()', function(){
        //    $scope.matrix = $scope.h.getAdjacentMatrix();
        //    console.log($scope.matrix);
        //});
        //
        //$scope.selectNode = function (id){
        //
        //    d3.select('#node-' + id + ' circle')
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('fill', '#000000')
        //        .attr('r', 20);
        //
        //    d3.select('#node-' + id + ' text')
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('fill', '#ffffff');
        //
        //    console.log(id);
        //};
        //
        //$scope.selectLink = function (source, target){
        //
        //    var link = '#link_' + source + '_'+ target;
        //
        //    d3.select(link)
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('stroke', 'red')
        //        .style('stroke-width',5);
        //
        //    console.log('visiting:' + link);
        //
        //
        //
        //};
        //
        //$scope.deselectNode = function (id){
        //    d3.select('#node-' + id + ' circle')
        //        .transition()
        //        .duration(250)
        //        .ease('linear')
        //        .style('fill', '#ffffff')
        //        .attr('r', 15);
        //
        //    d3.select('#node-' + id + ' text')
        //        .transition()
        //        .duration(250)
        //        .ease('linear')
        //        .style('fill', '#000000');
        //
        //    console.log('deselected:' + id);
        //};
        //
        //$scope.checkAdjacent = function(nodeA, nodeB){
        //
        //    for(var i = 0; i < $scope.h.linkList.length; i++){
        //        if($scope.h.linkList[i].source.id === nodeA.id && $scope.h.linkList[i].target.id === nodeB.id){
        //            return true;
        //        }
        //    }
        //    return false;
        //};
        //
        //$scope.currentOption = $scope.fabOptions.add;
        //$scope.isOpen = false;
        //$scope.hideFab = false;
        //
        //$scope.setSelectedOption = function (currentAction) {
        //    $scope.setCurrentOption(currentAction);
        //    $scope.toggleFab();
        //    $scope.showContextToolbar();
        //    //$scope.hideFab = true;
        //};
        //
        //$scope.selectedRow = null;
        //$scope.selectedColumn = null;
        //
        //$scope.selectCell = function(row, column){
        //
        //    $scope.selectedRow = row;
        //    $scope.selectedColumn = column;
        //
        //};
        //
        //$scope.deselectCell = function(){
        //    $scope.selectedRow = null;
        //    $scope.selectedColumn = null;
        //};
        //
        //$scope.toggleFab = function () {
        //    $scope.isOpen = !$scope.isOpen;
        //};
        //
        //function rescale_panels() {
        //    // get the width of graph-stage element and set to the graph element itself
        //    var graphStageDiv = $('#graphStageDiv');
        //    $scope.width = graphStageDiv.width();
        //    $scope.height = graphStageDiv.height();
        //}
        //
        //rescale_panels();
        //
        //// on window resize, resizes the graph
        //angular.element($window).on('resize', function () {
        //    $scope.$apply(function () {
        //        rescale_panels();
        //    });
        //});
        //
        //$scope.awesomeThings = [
        //    'HTML5 Boilerplate',
        //    'AngularJS',
        //    'Karma'
        //];
        //
        //var currentInstruction = 0;
        //
        //$scope.steps = [];
        //
        //$scope.selectedStep = -1;
        //
        //$scope.depthInstructions = algorithmService.steps;
        //
        //$scope.dfsResult = algorithmService.dfsResult;
        //
        //$scope.selectStep = function(step){
        //    $scope.selectedStep = step;
        //};
        //
        //var currentStep = 0;
        //
        ///*
        //* TODO add previous step, add current node display, highlight current visited link
        //*
        //* */
        //
        //$scope.nextStep = function(){
        //
        //    if(currentStep < $scope.steps.length) {
        //
        //
        //
        //        if(currentStep > 0) {
        //            // $scope.deselectNode($scope.steps[currentStep - 1].visited.index);
        //
        //            var sourceNode = $scope.steps[currentStep - 1].visited;
        //            var targetNode = $scope.steps[currentStep].visited;
        //
        //            if(sourceNode !== targetNode){
        //                $scope.selectLink(sourceNode.label, targetNode.label);
        //            }
        //
        //
        //        }
        //
        //        var step = $scope.steps[currentStep];
        //
        //        $scope.selectNode(step.visited.index);
        //
        //        $scope.selectedStep = step.instruction;
        //
        //        currentStep++;
        //    }
        //};
        //
        //$scope.runAlg = function(){
        //
        //    var initial = $scope.h.getNodes()[0];
        //    algorithmService.run($scope.h, initial);
        //    $scope.steps = algorithmService.dfsSteps;
        //
        //    // TODO add stop/pause
        //    $interval( $scope.nextStep, 500, $scope.steps.length);
        //
        //    console.log($scope.steps);
        //    //$scope.steps.push({ instruction: 5 });
        //};


    });
