/**
 * @ngdoc directive
 * @name grapheApp.directive:graph
 * @description
 * # graph
 */
angular.module('graphe.directives')
    .directive('gpStage', function () {
        'use strict';
        return {
            templateUrl: 'scripts/directives/gpStage.html',
            restrict: 'E',
            replace: true,
            require: '^gpContainer',
            controller: 'gpStageCtrl',

            link: function postLink(scope, element, attrs, gpContainerCtrl) {

                // clean element content

                //angular.element(element[0]).empty();

                // mouse event vars
                var selectedNode = null,
                    selectedLink = null;

                var nodeGroup;

                // init svg
                var outer = d3.select(element[0])
                    .append('svg:svg')
                    .attr('width', scope.stageWidth)
                    .attr('height', scope.stageHeight)
                    .attr('pointer-events', 'all')
                    .call(d3.behavior.zoom().on('zoom', rescale));

                outer.append('defs').append('marker')
                    .attr('id', 'arrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 25)
                    .attr('refY', 0)
                    .attr('markerWidth', 6)
                    .attr('markerHeight', 6)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M0,-5L10,0L0,5 L10,0 L0, -5')
                    .classed('marker',true)
                    //.style('stroke', 'black')
                    .style('opacity', '1');

                var xLines, yLines;
                var gridSize = 20;
                var gridWidth = 2000;
                var gridHeight = 2000;

                /**
                 * Draw a grid
                 */
                function drawGrid(){

                    xLines = vis.append('g')
                        .attr('class', 'x axis')
                        .selectAll('line')
                        .data(d3.range(0, gridWidth, gridSize))
                        .enter().append('line')
                        .attr('x1', function(d) { return d; })
                        .attr('y1', 0)
                        .attr('x2', function(d) { return d; })
                        .attr('y2', gridHeight);

                    yLines = vis.append('g')
                        .attr('class', 'y axis')
                        .selectAll('line')
                        .data(d3.range(0, gridHeight, gridSize))
                        .enter().append('line')
                        .attr('x1', 0)
                        .attr('y1', function(d) { return d; })
                        .attr('x2', gridWidth)
                        .attr('y2', function(d) { return d; });
                }

                function clickedOnStage(){

                    if(scope.getCurrentOption() === scope.fabOptions.add) {
                        var coordinates = d3.mouse(d3.event.target);

                        scope.graph.addNode(coordinates[0], coordinates[1]);
                        scope.updateNodeCount();

                        scope.$apply();
                        scope.showSimpleToast('node added!');
                    }
                }

                var vis = outer
                    .append('svg:g')
                    .attr('width', gridWidth)
                    .attr('height', gridHeight)
                    .on('dblclick.zoom', null)
                    .on('click', clickedOnStage)
                    .append('svg:g');

                // TODO: infinite grid
                drawGrid();

                vis.append('svg:rect')
                    .attr('width', gridWidth)
                    .attr('height', gridHeight)
                    .attr('fill', 'none');

                // init force layout
                var force = d3.layout.force()
                    .size([scope.width, scope.height])
                    .nodes(scope.graph.nodeList)
                    .links(scope.graph.linkList)
                    .on('tick', tick);

                // get layout properties
                var nodes = force.nodes(),
                    links = force.links(),
                    // group all links
                    link = vis.append('g').selectAll('.link'),
                    // using svg group, make all nodes to be in front of links
                    node = vis.append('g').selectAll('.node');

                // TODO: add keyboard callback
                //d3.select(window).on('keydown', keydown);

                redraw();

                // FIXME: tick function running every time is causing performance issues.
                function tick() {
                    node.each(collide(0.5)); //Added

                    node.attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });

                    link.attr('x1', function(d) { return d.source.x; })
                        .attr('y1', function(d) { return d.source.y; })
                        .attr('x2', function(d) { return d.target.x; })
                        .attr('y2', function(d) { return d.target.y; });
                }

                /**
                 * Rescale the visualization.
                 */
                function rescale() {
                    var trans=d3.event.translate;
                    var scale=d3.event.scale;
                    vis.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
                    //TODO: update grid size
                }

                // redraw force layout
                function redraw() {
                    outer
                        .attr('width' , scope.stageWidth)
                        .attr('height', scope.stageHeight);

                    link = link.data(links);
                    //drawGrid();

                    link.enter().append('line')
                        .attr('class', 'link')
                        .attr('id', function(d){
                            return 'link_' + d.source.label + '_' + d.target.label;
                        })
                    //    .on('mousedown',mousedownlink)
                    ;

                    link.exit().remove();
                    link.classed('link_selected', function(d) { return d === selectedLink; });
                    node = node.data(nodes);

                    /*
                    *  UPDATE
                    */

                    nodeGroup = node.select('g')
                        .attr('id', function(d,i){ return 'node-' + i; });

                    node.select('.node circle')
                        .attr('fill', function (d) { return d.color; } );

                    node.select('.node text')
                        .text(function(d){ return d.label; });

                    /*
                    * END UPDATE
                    */

                    nodeGroup = node.enter()
                        .append('g')
                        .attr('id', function(d,i){ return 'node-' + i; });

                    nodeGroup
                        .attr('class', 'node')
                        .append('circle')
                       // .attr('fill', function(d){ return d.color; })
                        .attr('r', 1)
                        .transition()
                        .duration(750)
                        .ease('elastic')
                        .attr('r', 15);

                    node.exit()
                        .select('circle')
                        .attr('r', 15)
                            .transition()
                            .duration(500)
                            .ease('linear')
                                .attr('r',1)
                                .remove();

                    node.exit().select('text').remove();

                    function dragMove (d, i) {

                        console.log('dragMove');
                        d.px += d3.event.dx;
                        d.py += d3.event.dy;
                        d.x += d3.event.dx;
                        d.y += d3.event.dy;

                        scope.$apply();
                    }

                    function dragStart(d,i){
                        // silence other listeners
                        d3.event.sourceEvent.stopPropagation();
                        console.log('dragStart');
                    }

                    function dragEnd(d,i){
                        console.log('dragEnd');
                    }

                    var nodeDrag = d3.behavior.drag()
                        .on('drag', dragMove)
                        .on("dragstart", dragStart)
                        .on("dragend", dragEnd);

                    nodeGroup.call(nodeDrag);

                    nodeGroup.on('click',mousedownnode);

                    var nodeLabel = nodeGroup
                        .append('text')
                        .attr('dx', 0 )
                        //.attr('fill', 'white')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.35em')
                        .text(function(d){
                            return d.label;
                        })
                        .on('click', function(d){

                            //TODO: add edit node label behavior
                            /*    var textElement = d3.select(this);
                             textElement.text(Math.random());
                             textElement.classed('edittext', true);
                             console.log(d);*/
                        });

                    function mousedownnode(d) {

                        console.log('mouseDownNode');

                        var self = this;

                        d3.event.stopPropagation(); // silence other listeners

                        if(scope.getCurrentOption() === scope.fabOptions.remove){
                            scope.graph.removeNode(d);
                            scope.$apply();
                            scope.updateNodeCount();
                            scope.showSimpleToast('node removed!');
                        }

                        else if(scope.getCurrentOption() === scope.fabOptions.info){
                            //TODO: add info screen
                            console.log(d);
                        }
                        else if(scope.getCurrentOption() === scope.fabOptions.add.contextOptions[1]){

                            console.log('add link');

                            if(!scope.firstNode) {
                                scope.$apply(function(){
                                    scope.firstNode = d;

                                    d3.select(self)
                                        .selectAll('circle')
                                        .style({
                                            'stroke': 'black',
                                            'stroke-width': 0
                                        })
                                        .transition()
                                        .duration(100)
                                        .ease('linear')
                                        .style({
                                            'stroke': 'black',
                                            'stroke-width': 2
                                        });

                                    console.log(d);
                                    scope.setMessage('Select next node.');
                                });
                            }
                            else if(scope.firstNode !== d){
                                scope.$apply(function () {
                                    scope.graph.addEdge(scope.firstNode.index, d.index);
                                    delete scope.firstNode;
                                    scope.setMessage(null);
                                });
                            }
                        }
                        redraw();
                    }
                    node.exit().transition()
                        .attr('r', 0)
                        .remove();

                    node.classed('node_selected', function (d) {
                        return d === selectedNode;
                    });

                    force.start();

                }

                    // separation between circles
                var padding = 2,
                    // TODO: replace by node radius
                    radius = 15;

                function collide(alpha) {

                    var quadtree = d3.geom.quadtree(scope.graph.nodeList);

                    return function(d) {
                        var rb = 2 * radius + padding,
                            nx1 = d.x - rb,
                            nx2 = d.x + rb,
                            ny1 = d.y - rb,
                            ny2 = d.y + rb;

                        quadtree.visit(function(node, x1, y1, x2, y2) {
                            if (node.point && (node.point !== d)) {
                                var x = d.x - node.point.x,
                                    y = d.y - node.point.y,
                                    l = Math.sqrt(x * x + y * y);
                                if (l < rb) {
                                    l = (l - rb) / l * alpha;

                                    x *= l;
                                    y *= l;
                                    d.x -= x;
                                    d.y -= y;
                                    node.point.x += x;
                                    node.point.y += y;
                                }
                            }
                            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                        });
                    };
                }

                scope.$watch('stageWidth', redraw);
                scope.$watch('stageHeight', redraw);
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

                    console.log('currentOption: ' + scope.currentOption);
                });
            }
        };
    })
    .controller('gpStageCtrl',function ($scope) {
        'use strict';

        $scope.selectNode = selectNode;
        $scope.selectLink = selectLink;
        $scope.deselectLink = deselectLink;
        $scope.deselectNode = deselectNode;


        function selectNode (id) {
            d3.select('#node-' + id + ' circle')
                .transition()
                .duration(250)
                //.ease('linear')
                .style('fill', '#000000')
                .attr('r', 20);

            d3.select('#node-' + id + ' text')
                .transition()
                .duration(250)
                //.ease('linear')
                .style('fill', '#ffffff');

            console.log(id);
        }

        function selectLink (source, target){
            var link = '#link_' + source + '_'+ target;
            d3.select(link)
                .transition()
                .duration(250)
                //.ease('linear')
                .style('stroke', 'red')
                //.style('stroke-width',5);

            console.log('visiting:' + link);
        }

        function deselectLink (source, target){
            var link = '#link_' + source + '_'+ target;
            d3.select(link)
                .transition()
                .duration(250)
                //.ease('linear')
                .style('stroke', 'black')
            //.style('stroke-width',5);

            console.log('exiting link :' + link);
        }

        function deselectNode (id){
            d3.select('#node-' + id + ' circle')
                .transition()
                .duration(250)
                .ease('linear')
                .style('fill', '#ffffff')
                .attr('r', 15);

            d3.select('#node-' + id + ' text')
                .transition()
                .duration(250)
                .ease('linear')
                .style('fill', '#000000');

            console.log('deselected:' + id);
        }

    });
