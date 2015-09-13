angular.module('graphe.directives')
    .directive('gpAdjascentMatrix', function () {
        'use strict';
        return {
            templateUrl: 'scripts/directives/gpAdjacentMatrix.html',
            restrict: 'E',
            require: ['^gpContainer', '^?gpStage'],
            //controller: 'gpAdjacentMatrixCtrl',
            link: function postLink(scope, element, attrs ) {



                function draw(){

                    console.log('drawing');
                    console.log(scope.matrix);

                    var columns = [];

                    scope.graph.getNodes().forEach(function(node){
                        columns.push(node.label);
                    });


                    angular.element(element[0]).empty().addClass('adjacency-matrix');

                    var tabela = d3.select(element[0]).append('table'),
                        thead = tabela.append('thead'),
                        tbody = tabela.append('tbody');

                    function mouseEnterCell(d,i){
                        d3.selectAll('.adjcol' + i).classed('highlight-cell', true);
                        scope.selectNode(columns[i]);
                        console.log('mouseover: ' + i);
                    }

                    function mouseLeaveCell(d,i){
                        d3.selectAll('.adjcol' + i).classed('highlight-cell', false);
                        console.log('mouseleave: ' + i);
                    }


                    function mouseEnterRow(d,i){
                        d3.selectAll('.adjrow' + i).classed('highlight-cell', true);


                    }

                    function mouseLeaveRow(d,i){
                        d3.selectAll('.adjrow' + i).classed('highlight-cell', false);

                    }

                    thead.append('tr')
                        .selectAll('th')
                        .data(columns)
                        .enter()
                        .append('th')
                        .text(function(d){
                            return d;
                        })
                        .attr('class', function(d,i){return 'adjcol' + i;} )
                        .on('mouseenter', mouseEnterCell)
                        .on('mouseleave', mouseLeaveCell);

                    tbody
                        .selectAll('tr')
                        .data(scope.graph.getAdjacentMatrix())
                        .enter()
                            .append('tr')
                            .attr('class', function(d,i){
                                return 'adjrow' + i;
                            } )
                            .on('mouseenter', mouseEnterRow)
                            .on('mouseleave', mouseLeaveRow)
                            .selectAll('td')
                            .data(function(d,i,j){
                                console.log('tr i: ' + i);

                                return d;
                            })
                            .enter()
                                .append('td')
                                    .text(function(d,i, j){
                                        console.log('td i: ' + i);
                                        return d.value;
                                    })
                                .attr('class', function(d,i){return 'adjcol' + i;} )
                                .on('mouseenter', mouseEnterCell)
                                .on('mouseleave', mouseLeaveCell);

                }

                draw();

                scope.$watch('graph.getAdjacentMatrix()', function(){
                    draw();
                });


            }
        };
    })
    //.controller('gpAdjacentMatrixCtrl', function(){
    //
    //})
;
