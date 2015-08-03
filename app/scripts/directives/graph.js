/**
 * @ngdoc directive
 * @name grapheApp.directive:graph
 * @description
 * # graph
 */
angular.module('grapheApp')
    .directive('graph', function () {
        'use strict';
        return {
            template: '<div></div>',
            /*scope: {
                width: '@',
                height: '@',
                graphData: '=',
                currentOption: '&'
            },*/
            restrict: 'E',

            link: function postLink(scope, element, attrs) {

                // clean element content
                angular.element(element[0]).empty();

                //scope.width = scope.width || 100;
                //scope.height = scope.height || 100;
                //scope.graphData = scope.graph;
                //scope.graphData = angular.fromJson(scope.graphData);

                //scope.graph = scope.graph || {links:[{}], nodes:[{}]};
                scope.currentOption = scope.currentOption || {};







                // mouse event vars
                var selected_node = null,
                    selected_link = null,
                    mousedown_link = null,
                    mousedown_node = null,
                    mouseup_node = null;

                var nodeGroup;

                // init svg
                var outer = d3.select(element[0])
                    .append("svg:svg")
                    .attr("width", scope.width)
                    .attr("height", scope.height)
                    .attr("pointer-events", "all")
                    .call(d3.behavior.zoom().on("zoom", rescale));


                var xLines, yLines;

                /**
                 * Draw a grid
                 */
                function drawGrid(){

                    if (xLines !== undefined) {
                        xLines.remove();
                    }
                    if (yLines !== undefined) {
                        yLines.remove();
                    }

                    xLines = vis.append("g")
                        .attr("class", "x axis")
                        .selectAll("line")
                        .data(d3.range(0, scope.width, 10))
                        .enter().append("line")
                        .attr("x1", function(d) { return d; })
                        .attr("y1", 0)
                        .attr("x2", function(d) { return d; })
                        .attr("y2", scope.height);

                    yLines = vis.append("g")
                        .attr("class", "y axis")
                        .selectAll("line")
                        .data(d3.range(0, scope.height, 10))
                        .enter().append("line")
                        .attr("x1", 0)
                        .attr("y1", function(d) { return d; })
                        .attr("x2", scope.width)
                        .attr("y2", function(d) { return d; });
                }

                function clickedOnStage(){
                    if(scope.currentOption === scope.fabOptions.add) {
                        var coordinates = d3.mouse(d3.event.target);
                        // used to force immediate update of angular digest
                        scope.$apply(function () {
                            scope.h.addNode(coordinates[0], coordinates[1]);
                        });
                        scope.showSimpleToast('node added!');
                    }
                }

                var vis = outer
                    .append('svg:g')
                    .on("dblclick.zoom", null)
                    .on('click', clickedOnStage)
                    // relative to the 'outer' container
                    .on("mousemove", mousemove)
                    //.on("mousedown", mousedown)
                    //.on("mouseup", mouseup)
                 /*   .on("drag", function(){
                      console.log('drag');
                    })*/
                    .append('svg:g');

                // TODO: infinite grid
                drawGrid();

                vis.append('svg:rect')
                    .attr('width', scope.width)
                    .attr('height', scope.height)
                    .attr('fill', 'none');

                // init force layout
                var force = d3.layout.force()
                    .size([scope.width, scope.height])
                    .nodes(scope.graph.nodes) // initialize with a single node
                    .links(scope.graph.links)
                    //.linkDistance(50)
                    //.gravity(0)
                    //.charge(-200)
                    .on("tick", tick);

                // line displayed when dragging new nodes
                var drag_line = vis.append("line")
                    .attr("class", "drag_line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", 0);

                // get layout properties
                var nodes = force.nodes(),
                    links = force.links(),
                    node = vis.selectAll(".node"),
                    link = vis.selectAll(".link");

                // add keyboard callback
                //d3.select(window).on("keydown", keydown);

                redraw();

                /**
                 * TODO: replace mousedown by drag.
                 */

                function mousedown() {
                    if (!mousedown_node && !mousedown_link) {
                        // allow panning if nothing is selected
                        console.log(vis);
                        vis.call(d3.behavior.zoom());
                            vis.on(".zoom", rescale);
                        return;
                    }
                }

                function mousemove() {

                    //console.log(d3.mouse(this));

                    if (!mousedown_node) {
                        return;
                    }

                    // update drag line
                    drag_line
                        .attr("x1", mousedown_node.x)
                        .attr("y1", mousedown_node.y)
                        .attr("x2", d3.mouse(this)[0])
                        .attr("y2", d3.mouse(this)[1]);
                }

                function mouseup() {
                    if (mousedown_node) {
                        // hide drag line
                        drag_line.attr("class", "drag_line_hidden");

                        if (!mouseup_node) {

                            // add node
                            var point = d3.mouse(this),
                                newNode = {
                                    x: point[0],
                                    y: point[1]
                                },
                                n;

                            // select new node
                            selected_node = newNode;
                            selected_link = null;

                            // instantaneous apply
                            scope.$apply(function(){

                                var newLink = {
                                    source: mousedown_node,
                                    target: newNode
                                };


                                n = nodes.push(newNode);

                                // add link to mousedown node
                                links.push(newLink);
                            });
                        }

                        redraw();
                    }
                    // clear mouse event vars
                    resetMouseVars();
                }

                function resetMouseVars() {
                    mousedown_node = null;
                    mouseup_node = null;
                    mousedown_link = null;
                }

                function tick() {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node.attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });



                }

                /**
                 * Rescale the visualization.
                 */
                function rescale() {
                    var trans=d3.event.translate;
                    var scale=d3.event.scale;
                    vis.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");



                    //drawGrid();

                }

                // redraw force layout
                function redraw() {

                    outer
                        .attr("width" , scope.width)
                        .attr("height", scope.height);

                    link = link.data(links);

                    //drawGrid();

                    link.enter().insert("line", ".node")
                        .attr("class", "link")
                        .on("mousedown",mousedownlink);

                    function mousedownlink(d){

                            mousedown_link = d;
                            if (mousedown_link === selected_link){
                                selected_link = null;
                            }
                            else {
                                selected_link = mousedown_link;
                            }
                            selected_node = null;
                            redraw();

                    }

                    link.exit().remove();

                    link.classed("link_selected", function(d) { return d === selected_link; });

                    node = node.data(nodes);

                    nodeGroup =
                        node.enter()
                            .append('g');

                        nodeGroup
                            .attr("class", "node")
                            .append('circle')
                            .attr('fill', function(d){
                                console.log(d.color);
                                return d.color;
                                //return materialColors[Math.random() * materialColors.length];
                                }
                            )
                            .attr("r", 1)
                                .transition()
                                .duration(750)
                                .ease("elastic")
                                    .attr("r", 15)

                            ;

                    node.exit().select('text').remove();

                    node.exit()
                        .select('circle')
                        .attr('r', 15)
                        .transition()
                        .duration(100)
                        .ease('linear')
                        .attr('r',1)
                        .remove();

                    nodeGroup.on("mousedown",mousedownnode);

                    var nodeLabel = nodeGroup
                        .append("text")
                            .attr("dx", 0 )
                        .attr('fill', 'white')
                        .attr('text-anchor', 'middle')
                            .attr("dy", ".35em")
                            .text(function(d){
                                return d.label;
                        })
                            .on("click", function(d){

                            //TODO: add edit node label behavior
                            /*    var textElement = d3.select(this);
                                textElement.text(Math.random());
                                textElement.classed('edittext', true);
                                console.log(d);*/
                            });






                    function mousedownnode(d) {
                        d3.event.stopPropagation(); // silence other listeners
                        





                        if(scope.currentOption === scope.fabOptions.remove){


                            scope.$apply(function () {
                                console.log(d);
                                scope.h.removeNode(d);
                            });



                            console.log('removed');

                        }

                        //mousedown_node = d;
                        //if (mousedown_node === selected_node) {
                        //    selected_node = null;
                        //}
                        //else {
                        //    selected_node = mousedown_node;
                        //}
                        //selected_link = null;
                        //
                        //// reposition drag line
                        //drag_line
                        //    .attr("class", "link")
                        //    .attr("x1", mousedown_node.x)
                        //    .attr("y1", mousedown_node.y)
                        //    .attr("x2", mousedown_node.x)
                        //    .attr("y2", mousedown_node.y);

                        redraw();
                    }

                    function mouseupnode(d) {
                        if (mousedown_node) {
                            mouseup_node = d;
                            if (mouseup_node === mousedown_node) { resetMouseVars(); return; }

                            // add link
                            var link = {source: mousedown_node, target: mouseup_node};
                            links.push(link);

                            // select new link
                            selected_link = link;
                            selected_node = null;

                            // enable zoom
                            vis.call(d3.behavior.zoom());
                            vis.on(".zoom", rescale);

                            redraw();
                        }
                    }



                    node.exit().transition()
                        .attr("r", 0)
                        .remove();

                    node.classed("node_selected", function(d) { return d === selected_node; });

                    if (d3.event) {
                        // prevent browser's default behavior
                        d3.event.preventDefault();
                    }

                    force.start();

                }

                function spliceLinksForNode(node) {
                    var toSplice = links.filter(
                        function (l) {
                            return (l.source === node) || (l.target === node);
                        });
                    toSplice.map(function (l) {
                        links.splice(links.indexOf(l), 1);
                    });
                }

                function keydown() {

                    console.log('keydown');

                    if (!selected_node && !selected_link){
                        return;
                    }
                    switch (d3.event.keyCode) {
                        case 8: // backspace
                        case 46: { // delete
                            if (selected_node) {
                                nodes.splice(nodes.indexOf(selected_node), 1);
                                spliceLinksForNode(selected_node);
                            }
                            else if (selected_link) {
                                links.splice(links.indexOf(selected_link), 1);
                            }
                            selected_link = null;
                            selected_node = null;
                            redraw();
                            break;
                        }
                    }
                }


                scope.$watch('width', redraw);
                scope.$watch('height', redraw);
                scope.$watch('graph', redraw, true);


                scope.$watch('currentOption', function () {

                    if(scope.currentOption === scope.fabOptions.select) {

                        nodeGroup.select('.node').style({
                            'cursor': 'hand'
                        });
                    }

                    if(scope.currentOption === scope.fabOptions.add) {

                        nodeGroup.select('.node').style({
                            'cursor': 'hand'
                        });
                    }

                    if(scope.currentOption === scope.fabOptions.remove) {

                        nodeGroup.style({
                            'cursor': 'pointer'
                        });

                        nodeGroup.call(function(){
                            console.log(this);
                        });
                    }


                    console.log(
                        scope.currentOption);
                });

            }
        };
    });
