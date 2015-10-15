(function () {
    'use strict';

    angular
        .module('graphe.directives')
        .directive('gpStage', gpStage)
        .controller('gpStageCtrl', gpStageCtrl);

    function gpStage() {

        var directive =
        {
            templateUrl: 'components/directives/stage/gpStage.tpl.html',
            restrict: 'E',
            replace: true,
            require: '^gpContainer',
            controller: 'gpStageCtrl',
            link: linkFn
        };

        return directive;
    }

    var selectedNode = null,
        selectedLink = null,
        nodeGroup,
        xLines,
        yLines,
        gridSize = 20,
        gridWidth = 2000,
        gridHeight = 2000,

        outer,
        vis,

        nodes,
        links,
    // groups all links
        link,
    // using svg group, make all nodes to be in front of links
        node,
    // separation between circles
    padding = 2,
    // TODO: replace by node radius
        radius = 15,
        force,
        scope;

    function linkFn(s, element, attrs, gpContainerCtrl) {
        scope = s;

    // clean element content
    //angular.element(element[0]).empty();
    // mouse event vars
    // init svg
        outer = d3.select(element[0])
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
            .classed('marker', true)
            //.style('stroke', 'black')
            .style('opacity', '1');

        vis = outer
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
        force = d3.layout.force()
            .size([scope.width, scope.height])
            .nodes(scope.graph.getNodes())
            .links(scope.graph.getEdges())
            .on('tick', tick);

        // get layout properties
        nodes = force.nodes();
        links = force.links();
        // groups all links
        link = vis.append('g').attr('id', 'link-group').selectAll('.link');
        // using svg group, make all nodes to be in front of links
        node = vis.append('g').selectAll('.node');

        // TODO: add keyboard callback
        //d3.select(window).on('keydown', keydown);

        redraw();

        scope.$watch('stageWidth', redraw);
        scope.$watch('stageHeight', redraw);
        scope.$watch('graph', redraw, true);
        scope.$watch('fab.currentOption', function () {
            if (scope.fab.currentOption === scope.fab.fabOptions.select) {
                nodeGroup.select('.node').style({ 'cursor': 'hand' });
            }

            if (scope.fab.currentOption === scope.fab.fabOptions.add) {
                nodeGroup.select('.node').style({ 'cursor': 'hand' });
            }

            if (scope.fab.currentOption === scope.fab.fabOptions.remove) {
                nodeGroup.style({ 'cursor': 'pointer' });

                nodeGroup.call(function () {
                    console.log(this);
                });
            }

            console.log('currentOption: ');
            console.log(scope.fab.currentOption);
        });

    }

    function gpStageCtrl($scope) {
        $scope.selectNode = selectNode;
        $scope.selectLink = selectLink;
        $scope.deselectLink = deselectLink;
        $scope.deselectNode = deselectNode;
        $scope.toggleOpacityLinks = toggleOpacityLinks;
    }

    function redraw() {
        outer
            .attr('width', scope.stageWidth)
            .attr('height', scope.stageHeight);

        link = link.data(links);

        link.enter().append('line')
            // TODO remove unnecessary code
            // .classed('link_selected', function (d) { return d === selectedLink; })
            .attr('class', 'link')
            .attr('id', function (d) {
                return 'link_' + d.source.label + '_' + d.target.label;
            })
            .on('mousedown', mousedownlink);

        link.exit().remove();

        node = node.data(nodes);

        /*
         *  UPDATE
         */

        //linkGroup.select('.g text')
        //    .text(function (d) { return d.label || 'dummy'; });


         nodeGroup = node.select('g')
         .attr('id', function (d, i) { return 'node-' + i;});

        node.select('.node circle')
            .attr('fill', function (d) { return d.color; });

        node.select('.node text')
            .text(function (d) { return d.label; });

        /*
         * END UPDATE
         */

        //linkGroup.append('text')
        //    .text(function (d) { return d.label || 'dummy'; });

        nodeGroup = node.enter()
            .append('g')
            .attr('id', function (d, i) {
                return 'node-' + i;
            });
        //    ;

        nodeGroup
            .attr('class', 'node')
            .append('circle')
            .attr('fill', function(d){ return d.color; })
            .attr('r', 1)
            .transition()
            .duration(750)
            .ease('elastic')
            .attr('r', 15);

        node.exit()
            .transition()
            //.select('circle')
            //.attr('r', 50)
            //.duration(500)
            //.ease('linear')
            //.attr('r',1)
            .remove();

        //node.exit().transition().delay(500).select('text').remove();



        var nodeDrag = d3.behavior.drag()
            .on('drag', dragMove)
            .on("dragstart", dragStart)
            .on("dragend", dragEnd);

        nodeGroup.call(nodeDrag);
        nodeGroup.on('click', mousedownnode);

        var nodeLabel = nodeGroup
            .append('text')
            .attr('dx', 0)
            //.attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(function (d) {
                return d.label;
            })
            .on('click', function (d) {
                //TODO: add edit node label behavior
                /*    var textElement = d3.select(this);
                 textElement.text(Math.random());
                 textElement.classed('edittext', true);
                 console.log(d);*/
            });

        node.exit().transition()
            .attr('r', 0)
            .remove();

        node.classed('node_selected', function (d) {
            return d === selectedNode;
        });

        force.start();

    }

    function dragMove(d, i) {
        scope.$apply(function () {
            console.log('dragMove');
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
        });
    }

    function mousedownlink(d) {
        if (scope.fab.currentOption === scope.fab.fabOptions.remove) {

            scope.$apply(function () {
                scope.graph.removeEdge(d.source, d.target);
                redraw();
            });

            scope.showSimpleToast('link removed!');
        }

    }

    function mousedownnode(d) {
        scope.$apply(function () { scope.setSelectedNode(d); });

        console.log('mouseDownNode');

        var self = this;

        d3.event.stopPropagation(); // silence other listeners

        if (scope.fab.currentOption === scope.fab.fabOptions.remove) {

            scope.$apply(function () {
                scope.graph.removeNode(d);
                scope.updateNodeCount();
                redraw();
            });

            scope.showSimpleToast('node removed!');
        }

        else if (scope.fab.currentOption === scope.fab.fabOptions.info) {
            //TODO: add info screen
            console.log(d);
        }
        else if (scope.fab.currentOption === scope.fab.fabOptions.add.contextOptions[1]) {

            if (!scope.firstNode) {
                scope.$apply(function () {
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
                    scope.setMessage('Select destination node.');
                });
            }
            else if (scope.firstNode !== d) {
                scope.$apply(function () {
                    scope.graph.addEdge(scope.firstNode.index, d.index);
                    delete scope.firstNode;
                    scope.setMessage('Select origin node.');
                });
            }
        }
        redraw();
    }

    function collideNodes(alpha) {

        var nodeList = scope.graph.getNodes();
        var quadtree = d3.geom.quadtree(nodeList);

        return function (d) {
            var rb = 2 * radius + padding,
                nx1 = d.x - rb,
                nx2 = d.x + rb,
                ny1 = d.y - rb,
                ny2 = d.y + rb;

            quadtree.visit(function (node, x1, y1, x2, y2) {
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

    function toggleOpacityLinks() {
        d3.select('#link-group').selectAll('line')
            .transition()
            .duration(250)
            .attr('opacity', 0.1);
    }

    function selectNode(node) {

        var selection = d3.selectAll('.node').filter(function (d, i) {
            return d.index === node.index;
        });

        selection.select('circle')
            .transition()
            .duration(250)
            //.ease('linear')
            .style('fill', '#000000')
            .attr('r', 20);

        selection.select('text')
            .transition()
            .duration(250)
            //.ease('linear')
            .style('fill', '#ffffff');
    }

    function selectLink(source, target) {


        // Select the link based on source and target objects
        var selectedLink = d3.selectAll('.link').filter(function (d, i) {
            return d.source === source && d.target === target;
        }).data()[0];



        if (selectedLink === undefined) {
            console.log('link doesnt exists! ' + source.label + ' ' + target.label);
            return;
        }

        var points = [
            // start
            [selectedLink.source.x, selectedLink.source.y],
            // end
            [selectedLink.target.x, selectedLink.target.y]
        ];

        var line = d3.svg.line()
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; })
            .interpolate('basis');

        var svg = d3.select("svg #link-group");

        var path = svg.append("path")
            .attr("d", line(points));

        var arrow = svg.append("path")
            .style("fill", "none")
            .style("stroke", "red")
            .style("stroke-width", "red")
            .attr("d", "M0, -5L10, 0L0, 5");

        var totalLength = path.node().getTotalLength() - 30;
        var animationTime = 1000;
        var currentPath = path.node();

        transition();

        function transition() {
            arrow
                .transition()
                .duration(animationTime)
                .attrTween("transform", arrowTween);
            path
                .transition()
                .duration(animationTime)
                .attrTween('stroke-dasharray', tweenDash);
        }

        function tweenDash() {
            return function (t) {
                var length = totalLength * t;
                return length + ',' + totalLength;
            };
        }

        function arrowTween(d, i, a) {
            var t0 = 0;
            // time, between 0 and 1
            return function (t) {
                var pointAtLenght = currentPath.getPointAtLength(totalLength * t);
                //previous point
                var previousPosition = currentPath.getPointAtLength(totalLength * t0);
                //angle for tangent
                var angle = Math.atan2(pointAtLenght.y - previousPosition.y, pointAtLenght.x - previousPosition.x) * 180 / Math.PI;
                t0 = t;

                return "translate(" + pointAtLenght.x + ',' + pointAtLenght.y + ')rotate(' + angle + ")";
            };
        }
    }





    function deselectLink(source, target) {
        var link = '#link_' + source + '_' + target;
        d3.select(link)
            .transition()
            .duration(250)
            //.ease('linear')
            .style('stroke', 'black');
            //.style('stroke-width',5);

        console.log('exiting link :' + link);
    }

    function deselectNode(node) {

        var selection = d3.selectAll('.node').filter(function (d, i) {
            return d.index === node.index;
        });



        selection.select('circle')
            .transition()
            .duration(250)
            //.ease('linear')
            .style('fill', '#fff')
            .attr('r', 15);

        selection.select('text')
            .transition()
            .duration(250)
            //.ease('linear')
            .style('fill', '#000');
    }

    /*
    TODO: remove unused code
    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString('0,' + l, l + ',' + l);
        return function (t) {

            return i(t);
        };
    }
    */

    /*
    TODO: remove unused code
    function transition(path) {
        path.transition()
            .duration(1000)
            .attrTween('stroke-dasharray', tweenDash);
    }
    */

    function dragStart(d, i) {
        // silence other listeners
        d3.event.sourceEvent.stopPropagation();
        console.log('dragStart');


    }

    function dragEnd(d, i) {
        console.log('dragEnd');
    }

    function drawGrid() {
        xLines = vis.append('g')
            .attr('class', 'x axis')
            .selectAll('line')
            .data(d3.range(0, gridWidth, gridSize))
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return d;
            })
            .attr('y1', 0)
            .attr('x2', function (d) {
                return d;
            })
            .attr('y2', gridHeight);

        yLines = vis.append('g')
            .attr('class', 'y axis')
            .selectAll('line')
            .data(d3.range(0, gridHeight, gridSize))
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('y1', function (d) {
                return d;
            })
            .attr('x2', gridWidth)
            .attr('y2', function (d) {
                return d;
            });
    }

    function clickedOnStage() {

        if (scope.fab.currentOption === scope.fab.fabOptions.add) {
            var coordinates = d3.mouse(d3.event.target);

            scope.graph.addNode({x:coordinates[0], y:coordinates[1], fixed:true});
            scope.updateNodeCount();

            scope.$apply();
            scope.showSimpleToast('node added!');
        }
    }

    function tick() {
        // Collision detection
        // node.each(collideNodes(0.5));

        node.attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

        link.
            attr('x1', function (d) { return d.source.x; })
            .attr('y1', function (d) { return d.source.y; })
            .attr('x2', function (d) { return d.target.x; })
            .attr('y2', function (d) { return d.target.y; });
    }

    function rescale() {
        var trans = d3.event.translate;
        var scale = d3.event.scale;
        vis.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
        //TODO: update grid size
    }

})();
