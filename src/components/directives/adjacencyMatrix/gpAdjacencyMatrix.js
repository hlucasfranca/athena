(function () {
    'use strict';
    /**
     * gpAdjascentMatrix
     *
     * Directive to display the adjacency matrix
     */
    angular.module('graphe.directives')
        .directive('gpAdjacencyMatrix', function () {

            function draw(scope, element) {
                var columns = [];

                scope.graph.getNodes().forEach(function (node) {
                    columns.push(node.label);
                });

                angular.element(element[0]).empty().addClass('adjacency-matrix');

                var tabela = d3.select(element[0]).append('table'),
                    thead = tabela.append('thead'),
                    tbody = tabela.append('tbody');

                function mouseEnterCell(d, i) {
                    d3.selectAll('.adjcol' + i).classed('highlight-cell', true);
                    scope.selectNode(columns[i]);
                    console.log('mouseover: ' + i);
                }

                function mouseLeaveCell(d, i) {
                    d3.selectAll('.adjcol' + i).classed('highlight-cell', false);
                    console.log('mouseleave: ' + i);
                }

                function mouseEnterRow(d, i) {
                    d3.selectAll('.adjrow' + i).classed('highlight-cell', true);
                }

                function mouseLeaveRow(d, i) {
                    d3.selectAll('.adjrow' + i).classed('highlight-cell', false);
                }

                thead.append('tr')
                    .selectAll('th')
                    .data(columns)
                    .enter()
                    .append('th')
                    .text(function (d) {
                        return d;
                    })
                    .attr('class', function (d, i) {
                        return 'adjcol' + i;
                    })
                    .on('mouseenter', mouseEnterCell)
                    .on('mouseleave', mouseLeaveCell);

                tbody
                    .selectAll('tr')
                    .data(scope.graph.getAdjacencyMatrix())
                    .enter()
                    .append('tr')
                    .attr('class', function (d, i) {
                        return 'adjrow' + i;
                    })
                    .on('mouseenter', mouseEnterRow)
                    .on('mouseleave', mouseLeaveRow)
                    .selectAll('td')
                    .data(function (d) {
                        return d;
                    })
                    .enter()
                    .append('td')
                    .text(function (d) {
                        return d.value;
                    })
                    .attr('class', function (d, i) {
                        return 'adjcol' + i;
                    })
                    .on('mouseenter', mouseEnterCell)
                    .on('mouseleave', mouseLeaveCell);
            }

            function postLink(scope, element) {
                draw(scope, element);
                scope.$watch('graph.getAdjacentMatrix()', function () {
                    draw(scope, element);
                });
            }

            return {
                templateUrl: 'components/directives/adjacencyMatrix/gpAdjacencyMatrix.html',
                restrict: 'E',
                require: ['^gpContainer', '^?gpStage'],
                link: postLink
            };
        });
})();