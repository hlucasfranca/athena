'use strict';

/**
 * @ngdoc directive
 * @name grapheApp.directive:graph
 * @description
 * # graph
 */
angular.module('grapheApp')
    .directive('graph', function () {
        return {
            template: '<div></div>',
            scope: {
                width: '@',
                height: '@',
                graphData: '@'
            },
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

                scope.tick = function () {

                    scope.link
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });

                    scope.node
                        .attr("cx", function (d) { return isNaN(d.x)? 0 : d.x; })
                        .attr("cy", function (d) { return isNaN(d.y)? 0 : d.y; });
                };

                scope.start = function () {



                    scope.width = scope.width || 100;
                    scope.height = scope.height || 100;
                    scope.graphData = angular.fromJson(scope.graphData);
                    scope.color = d3.scale.category20();

                    // clean element content
                    $(element[0]).empty();

                    // sets the element width and height
                    $(element[0]).css('width', scope.width);
                    $(element[0]).css('height', scope.height);

                    scope.svg = d3.select(element[0])
                        .append("svg")
                            .attr("width", scope.width)
                            .attr("height", scope.height);

                    scope.force = d3.layout.force()
                        .charge(-120)
                        .linkDistance(30)
                        .size([scope.width, scope.height])
                        .nodes(scope.graphData.nodes)
                        .links(scope.graphData.links)
                        .start();

                    scope.link = scope.svg.selectAll(".link")
                        .data(scope.graphData.links)
                        .enter().append("line")
                        .attr("class", "link")
                        .style("stroke-width", function (d) {
                            return Math.sqrt(d.value);
                        });

                    scope.node = scope.svg.selectAll(".node")
                        .data(scope.graphData.nodes)
                        .enter().append("circle")
                        .attr("class", "node")
                        .attr("r", 5)
                        .style("fill", function (d) {
                            return scope.color(d.group);
                        })
                        .call(scope.force.drag);

                    scope.node.append("title")
                        .text(function (d) {
                            return d.name;
                        });

                    scope.force.on("tick", scope.tick);
                };

                scope.update = function(){

                    //scope.graphData = angular.fromJson(scope.graphData);
                    //
                    //scope.force
                    //    .size([scope.width, scope.height])
                    //    .nodes(scope.graphData.nodes)
                    //    .links(scope.graphData.links);
                    //
                    //scope.link = scope.svg.selectAll(".link")
                    //    .data(scope.graphData.links)
                    //    .enter().append("line")
                    //    .attr("class", "link")
                    //    .style("stroke-width", function (d) {
                    //        return Math.sqrt(d.value);
                    //    });
                    //
                    //scope.node = scope.svg.selectAll(".node")
                    //    .data(scope.graphData.nodes);
                    //
                    //scope.node.enter().append("circle")
                    //    .attr("class", "node")
                    //    .attr("r", 5)
                    //    .style("fill", function (d) {
                    //        return scope.color(d.group);
                    //    })
                    //    .call(scope.force.drag);
                    //
                    //scope.node.exit().remove();
                    ////scope.force.resume();
                    ////scope.force.on("tick", scope.tick);

                };

                scope.$watch('width', function () {
                    scope.start();
                });

                scope.$watch('height', function () {
                    scope.start();
                });

                // usado para verificar se o grafo foi alterado externamente
                scope.$watch('graphData', function () {
                    scope.force.stop();

                    scope.start();
                }, true);

                scope.start();
            }
        };
    });
