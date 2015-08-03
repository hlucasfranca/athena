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

        function updateNode(){
            console.log('updating node count');
            $scope.graph.nodes = $scope.h.getNodes();
            $scope.graph.links = $scope.h.getLinks();
        }

        $scope.graph = {
            nodes:  $scope.h.getNodes(),
            links: $scope.h.getLinks()
        };

        $scope.$watch('h', function ($scope) {
                updateNode();
            }, true
        );

        $scope.currentOption = $scope.fabOptions.add;
        $scope.isOpen = false;

        $scope.setSelectedOption = function (currentAction) {
            $scope.currentOption = currentAction;
            $scope.showSimpleToast(currentAction.message);
            $scope.toggleFab();
        };

        $scope.toggleFab = function () {
            $scope.isOpen = !$scope.isOpen;
        };

        $scope.width = 100;
        $scope.height = 600;

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
