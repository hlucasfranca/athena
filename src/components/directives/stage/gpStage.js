(function () {
    'use strict';

    angular
        .module('graphe.directives')
        .directive('gpStage', ['fab', 'toast', gpStageDirective])
        .controller('gpStageCtrl', gpStageCtrl);

    function gpStageDirective(fab, toast) {

        var directive = {
            templateUrl: 'components/directives/stage/gpStage.tpl.html',
            restrict: 'E',
            replace: true,
            scope: {
                width: '=',
                height: '=',
                graph: '='
            },
            require: '^gpContainer',
            controller: 'gpStageCtrl',
            controllerAs: 'stage',
            link: postLink
        };


        function postLink(scope, element, attrs, gpContainerCtrl) {

            scope.fab = fab;

            scope.setSelectedOption = gpContainerCtrl.setSelectedOption;
            //scope.showNodeEditDialog = gpContainerCtrl.showNodeEditDialog;

            var selectedNode = null,
                selectedLink = null,
                nodeGroup,
                gridSize = 20,
                gridWidth = 2000,
                gridHeight = 2000,
                outer,
                vis,
                allLinksGroup,
                allNodesGroup,
                nodePadding = 2,
                // TODO: replace by node radius
                nodeRadius = 15,
                force;

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

            // groups all links
            allLinksGroup = vis.append('g').attr('id', 'link-group').selectAll('.link');
            // using svg group, make all nodes to be in front of links
            allNodesGroup = vis.append('g').selectAll('.node');

            // TODO: add keyboard callback
            //d3.select(window).on('keydown', keydown);

            redraw();

            function redraw() {

                console.log('redraw');

                outer
                    .attr('width', scope.width)
                    .attr('height', scope.height);

                allLinksGroup = allLinksGroup.data(scope.graph.getEdges());

                allLinksGroup.enter().append('line')
                    // TODO remove unnecessary code
                    .attr('class', 'link')
                    .attr('id', function (d) { return 'link_' + d.source.label + '_' + d.target.label; })
                    .on('mousedown', mousedownlink);

                allLinksGroup.exit().remove();

                // use a custom function to get the key associated with the node
                allNodesGroup = allNodesGroup.data(scope.graph.getNodes(), function(d){return d.id;});

                updateSelections();

                nodeGroup = allNodesGroup.enter()
                    .append('g')
                        .attr('id', function (d, i) { return 'node-' + i; });

                nodeGroup
                    .attr('class', 'node')
                    .append('circle')
                    .attr('fill', function (d) {
                        return d3.rgb(d.color).toString();
                    })
                    .attr('r', 1)
                    .transition()
                    .duration(750)
                    .ease('elastic')
                    .attr('r', function(d){ return d.radius;});

                allNodesGroup.exit()
                    .transition()
                    .select('circle')
                    .attr('r', 150 )
                    .style('opacity', 1 )
                    .duration(1000)
                    //.ease('linear')
                    .attr('r', 0)
                    .style('opacity', 0 )
                    .remove();

                allNodesGroup
                    .exit()
                    .transition()
                    .select('text')
                    .style('opacity', 1 )
                    .duration(500)
                    .style('opacity', 0 )
                    .remove();

                var nodeDrag = d3.behavior.drag()
                    .on('drag', dragMove)
                    .on("dragstart", dragStart)
                    .on("dragend", dragEnd);

                nodeGroup.call(nodeDrag);
                nodeGroup.on('click', mousedownnode)
                    .on('dblclick', function (d) {
                        d3.event.stopPropagation(); // silence other listeners

                        //edit the double clicked node
                        gpContainerCtrl.showNodeEditDialog(d, function(){
                            redraw();
                        });

                    });

                var nodeLabel = nodeGroup
                    .append('text')
                    .attr('dx', 0)
                    //.attr('fill', 'white')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '.35em')
                    .text(function (d) {
                        return d.label;
                    });



                allNodesGroup.classed('node_selected', function (d) {
                    return d === selectedNode;
                });

                force.start();

            }

            function updateSelections(){
                allLinksGroup.select('.g text').text(function (d) {
                    return d.label || 'dummy';
                });

                nodeGroup = allNodesGroup.select('g').attr('id', function (d, i) {
                    return 'node-' + i;
                });

                allNodesGroup.select('.node circle')
                    .attr('r', function(d){

                        var texto = d3.select(this.parentNode).select('text')[0][0].getBBox() || 0;

                        if(texto.width > d.radius * 2){
                            d.radius = texto.width + 2;
                        }

                        return d.radius;

                    })
                    .attr('fill', function (d) {
                        return d3.rgb(d.color).toString();
                    });

                allNodesGroup.select('.node text').text(function (d) {
                    return d.label;
                });
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
                if (fab.currentOption === fab.fabOptions.remove) {
                    scope.$apply(function () {
                        scope.graph.removeEdge(d.source, d.target);
                        redraw();
                    });
                    toast.showSimpleToast('link removed!');
                }
            }

            function mousedownnode(d) {
                scope.$apply(function () {
                    gpContainerCtrl.setSelectedNode(d);
                });

                console.log('mouseDownNode');

                var self = this;

                d3.event.stopPropagation(); // silence other listeners

                switch (fab.currentOption) {
                    case fab.fabOptions.remove:
                        scope.$apply(function () {

                            console.log('removing');
                            console.log(d);

                            scope.graph.removeNode(d);
                            gpContainerCtrl.updateNodeCount();
                            redraw();
                        });

                        scope.showSimpleToast('node removed!');
                        break;
                    case fab.fabOptions.info:
                        console.log(d);
                        break;
                    case fab.fabOptions.add.contextOptions[1]:
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
                        break;
                }

                redraw();
            }

            //function collideNodes(alpha) {
            //
            //    var quadtree = d3.geom.quadtree(scope.graph.getNodes());
            //
            //    return function (d) {
            //        var rb = 2 * d.size + nodePadding,
            //            nx1 = d.x - rb,
            //            nx2 = d.x + rb,
            //            ny1 = d.y - rb,
            //            ny2 = d.y + rb;
            //
            //        quadtree.visit(function (node, x1, y1, x2, y2) {
            //            if (node.point && (node.point !== d)) {
            //                var x = d.x - node.point.x,
            //                    y = d.y - node.point.y,
            //                    l = Math.sqrt(x * x + y * y);
            //                if (l < rb) {
            //                    l = (l - rb) / l * alpha;
            //
            //                    x *= l;
            //                    y *= l;
            //                    d.x -= x;
            //                    d.y -= y;
            //                    node.point.x += x;
            //                    node.point.y += y;
            //                }
            //            }
            //            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            //        });
            //    };
            //}

            function dragStart(d, i) {
                // silence other listeners
                d3.event.sourceEvent.stopPropagation();
                console.log('dragStart');
            }

            function dragEnd(d, i) {
                scope.$apply();
                console.log('dragEnd');
            }

            function drawGrid() {
                vis.append('g')
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

                vis.append('g')
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

                if (fab.currentOption === fab.fabOptions.add) {
                    var coordinates = d3.mouse(d3.event.target);

                    scope.graph.addNode({x: coordinates[0], y: coordinates[1], fixed: true, radius:15, color:d3.rgb(255,255,255)});
                    gpContainerCtrl.updateNodeCount();

                    scope.$apply();
                    toast.showSimpleToast('node added!');
                }
            }

            function tick() {
                // Collision detection

                var nodes = scope.graph.getNodes();

                var q = d3.geom.quadtree(nodes),
                    i = 0,
                    n = nodes.length;

                while (++i < n) q.visit(collide(nodes[i]));



                function collide(node) {
                    var r = node.radius + 16,
                        nx1 = node.x - r,
                        nx2 = node.x + r,
                        ny1 = node.y - r,
                        ny2 = node.y + r;
                    return function(quad, x1, y1, x2, y2) {
                        if (quad.point && (quad.point !== node)) {
                            var x = node.x - quad.point.x,
                                y = node.y - quad.point.y,
                                l = Math.sqrt(x * x + y * y),
                                r = node.radius + quad.point.radius;
                            if (l < r) {
                                l = (l - r) / l * .5;
                                node.x -= x *= l;
                                node.y -= y *= l;
                                quad.point.x += x;
                                quad.point.y += y;
                            }
                        }
                        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    };
                }




                //allNodesGroup.each(collideNodes(0.5));

                allNodesGroup.attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

                allLinksGroup
                    .attr('x1', function (d) {
                        return d.source.x;
                    })
                    .attr('y1', function (d) {
                        return d.source.y;
                    })
                    .attr('x2', function (d) {
                        return d.target.x;
                    })
                    .attr('y2', function (d) {
                        return d.target.y;
                    });
            }

            function rescale() {
                var trans = d3.event.translate;
                var scale = d3.event.scale;
                vis.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
                //TODO: update grid size
            }


            scope.$on('window.resized', function (event,dimensions) {
                console.log('window.resized');

                console.log(dimensions);
                redraw();
            });

            scope.$watch('graph', redraw, true);
            scope.$watch('fab.currentOption', function () {

                switch (fab.currentOption) {
                    case fab.fabOptions.select:
                        nodeGroup.select('.node').style({'cursor': 'hand'});
                        break;
                    case fab.fabOptions.add:
                        nodeGroup.select('.node').style({'cursor': 'hand'});
                        break;
                    case fab.fabOptions.remove:
                        nodeGroup.style({'cursor': 'pointer'});
                        break;
                }
                console.log('currentOption: ');
                console.log(fab.currentOption);
            });
        }

        return directive;
    }


    function gpStageCtrl($scope) {
        var vm = this;

        vm.selectNode = selectNode;
        vm.selectLink = selectLink;
        vm.deselectLink = deselectLink;
        vm.deselectNode = deselectNode;
        vm.toggleOpacityLinks = toggleOpacityLinks;

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
                .attr('r', function(d){ return d.radius;});

            selection.select('text')
                .transition()
                .duration(250)
                //.ease('linear')
                .style('fill', '#000');
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
                .x(function (d) {
                    return d[0];
                })
                .y(function (d) {
                    return d[1];
                })
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

        function selectNode(node) {

            var selection = d3.selectAll('.node').filter(function (d, i) {
                return d.index === node.index;
            });

            selection.select('circle')
                .transition()
                .duration(250)
                //.ease('linear')
                .style('fill', '#000000')
                .attr('r', function(d){
                    return d.radius * 2;
                });

            selection.select('text')
                .transition()
                .duration(250)
                //.ease('linear')
                .style('fill', '#ffffff');
        }

        function toggleOpacityLinks() {
            d3.select('#link-group').selectAll('line')
                .transition()
                .duration(250)
                .attr('opacity', 0.1);
        }
    }

})();
