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
            scope: {
                width: '@',
                height: '@',
                graphData: '='
            },
            restrict: 'E',

            link: function postLink(scope, element, attrs) {

                // clean element content
                angular.element(element[0]).empty();

                scope.width = scope.width || 100;
                scope.height = scope.height || 100;
                scope.graphData = angular.fromJson(scope.graphData);
                scope.graphData = scope.graphData || {links:[{}], nodes:[{}]};
                scope.color = d3.scale.category20();

                // mouse event vars
                var selected_node = null,
                    selected_link = null,
                    mousedown_link = null,
                    mousedown_node = null,
                    mouseup_node = null;

                // init svg
                var outer = d3.select(element[0])
                    .append("svg:svg")
                    .attr("width", scope.width)
                    .attr("height", scope.height)
                    .attr("pointer-events", "all")
                    .call(d3.behavior.zoom().on("zoom", rescale));

                /**
                 * Draw a grid
                 */
                function drawGrid(){
                    vis.append("g")
                        .attr("class", "x axis")
                        .selectAll("line")
                        .data(d3.range(0, scope.width, 10))
                        .enter().append("line")
                        .attr("x1", function(d) { return d; })
                        .attr("y1", 0)
                        .attr("x2", function(d) { return d; })
                        .attr("y2", scope.height);

                    vis.append("g")
                        .attr("class", "y axis")
                        .selectAll("line")
                        .data(d3.range(0, scope.height, 10))
                        .enter().append("line")
                        .attr("x1", 0)
                        .attr("y1", function(d) { return d; })
                        .attr("x2", scope.width)
                        .attr("y2", function(d) { return d; });
                }

                var vis = outer
                    .append('svg:g')
                    .on("dblclick.zoom", null)
                    .append('svg:g')
                    .on("mousemove", mousemove)
                    .on("mousedown", mousedown)
                    .on("mouseup", mouseup);

                // TODO: infinite grid
                drawGrid();

                vis.append('svg:rect')
                    .attr('width', scope.width)
                    .attr('height', scope.height)
                    .attr('fill', 'none');

                // init force layout
                var force = d3.layout.force()
                    .size([scope.width, scope.height])
                    .nodes(scope.graphData.nodes) // initialize with a single node
                    .links(scope.graphData.links)
                    .linkDistance(50)
                    .gravity(0)
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
                d3.select(window).on("keydown", keydown);

                redraw();

                /**
                 * TODO: replace mousedown by drag.
                 */

                //function dragstarted(d) {
                //    d3.event.sourceEvent.stopPropagation();
                //    d3.select(this).classed("dragging", true);
                //}

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
                        drag_line.attr("class", "drag_line_hidden")

                        if (!mouseup_node) {

                            // add node
                            var point = d3.mouse(this),
                                node = {x: point[0], y: point[1]},
                                n;

                            // select new node
                            selected_node = node;
                            selected_link = null;

                            // instantaneous apply
                            scope.$apply(function(){
                                n = nodes.push(node);

                                // add link to mousedown node
                                links.push({source: mousedown_node, target: node});
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
                }

                // redraw force layout
                function redraw() {
                    outer
                        .attr("width" , scope.width)
                        .attr("height", scope.height);

                    link = link.data(links);

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

                    node.enter()
                        .append('g')
                        .attr("class", "node")
                        .append('circle')
                        .attr("r", 5)
                        .on("mousedown", mousedownnode)
                        .on("mousedrag", mousedragnode)
                        .on("mouseup",mouseupnode)
                        .transition()
                        .duration(100)
                        .ease("elastic")
                        .attr("r", 6);

                    /**
                     * TODO: correct multiple labels per node.
                     */
                    node
                        .append("text")
                        .attr("dx", 12 )
                        .attr("dy", ".35em")
                        .text(function(d){return "node";});



                    function mousedragnode(){
                            console.log('drag');
                            // redraw();

                    }

                    function mousedownnode(d) {

                        // prevent drag
                        d3.event.stopPropagation();

                        // disable zoom
                        //  console.log(vis);
                        vis.call(d3.behavior.zoom());
                        vis.on(".zoom", null);

                        mousedown_node = d;
                        if (mousedown_node === selected_node) {
                            selected_node = null;
                        }
                        else {
                            selected_node = mousedown_node;
                        }
                        selected_link = null;

                        // reposition drag line
                        drag_line
                            .attr("class", "link")
                            .attr("x1", mousedown_node.x)
                            .attr("y1", mousedown_node.y)
                            .attr("x2", mousedown_node.x)
                            .attr("y2", mousedown_node.y);

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
                scope.$watch('graphData', redraw, true);

            }
        };
    });
