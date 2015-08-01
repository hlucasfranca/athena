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



        $scope.graph = {
            nodes: [
                {name: "foo"},
                {name: "bar" }
            ],
            links: [
                {source: 1, target: 0}
            ]
        };

        $scope.g = GraphService.getGraph(10);
        $scope.h = GraphService.getGraph(5);

        $scope.g.addEdge(0, 1);

        console.log('graph object');
        console.log($scope.g);
        console.log($scope.h);

        console.log('adding node');
        $scope.h.addNode();

        console.log('after add');
        console.log($scope.h);

        console.log('showing graph');
        $scope.g.showGraph();

        $scope.selected = $scope.fabOptions.add;
        $scope.isOpen = false;

        $scope.setSelected = function (currentAction) {
            $scope.selected = currentAction;
            $scope.showSimpleToast(currentAction.message);
            $scope.toggleFab();
        };



        $scope.toggleFab = function () {
            $scope.isOpen = !$scope.isOpen;
        };

        $scope.width = 100;
        $scope.height = 600;

        $scope.removeNode = function (index) {
            $scope.g.removeNode(index);
        };

        $scope.addNode = function () {
            $scope.g.addNode();
        };

        function rescale_panels() {
            // get the width of graph-stage element and set to the graph element itself
            $scope.width = $('md-content').width();
            $scope.height = $($window).height() - $('#toolbar').height();
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
