(function () {
    'use strict';
    /*
     * gpAdjascentList
     *
     * Directive to display the adjacency list.
     * gpAdjacencyList
     * */
    angular.module('graphe.directives')
        .directive('gpAdjascentList', function () {
            return {
                templateUrl: 'components/directives/adjacencyList/gpAdjacencyList.tpl.html',
                restrict: 'E',
                require: '^gpContainer',
                link: function postLink(scope, element, attrs) {

                    scope.adjacencyList = scope.graph.getAdjacencyList();

                    scope.$watch('graph.getAdjacencyList()', function () {

                        scope.$apply(function(){
                            scope.adjacencyList = graph.getAdjacencyList();
                        });

                    },true);

                }
            };
        });
})();