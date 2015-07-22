'use strict';

/**
 * @ngdoc function
 * @name grapheApp.controller:GraphCtrl
 * @description
 * # GraphCtrl
 * Controller of the grapheApp
 */
angular.module('grapheApp')
    .controller('GraphCtrl', function ($scope, $rootScope, $window) {


        $scope.showSimpleToast();


        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.width = 100;
        $scope.height = 600;
        $scope.showInfo = false;

        $scope.removeNode = function(){
            $rootScope.graph.nodes.shift();
        }

        $scope.addNode = function(){
            $rootScope.graph.nodes.push({name:'foo',group:1});
        }

        $scope.graph = {
            nodes: [
                {name: "foo"},
                {name: "bar" }
            ],
            links: [
                {source: 1, target: 0}
            ]
        };

        // on window resize, resizes the graph
        angular.element($window).on('resize', function(){
            $scope.$apply(function(){
                rescale_panels();
            });
        });

        function rescale_panels(){
            // get the width of graph-stage element and set to the graph element itself
            //var width = angular.element('.graph-stage').width();
            var width = angular.element('#main-content').width();

            $scope.width = width;

        }

        rescale_panels();

        $scope.toogleInfo = function(){
            $scope.showInfo = !$scope.showInfo;
        };

       

    });
