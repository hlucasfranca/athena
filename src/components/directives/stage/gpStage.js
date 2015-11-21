(function () {
    'use strict';

    angular
        .module('graphe.directives')
        .directive('gpStage', ['fab', 'toast', 'broadcastService', gpStageDirective])
        .controller('gpStageCtrl', gpStageCtrl);

    function gpStageDirective(fab, toast, broadcastService) {

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


            /**
             * Função que redesenha o grafo na tela, só deve ser chamada quando a tela é redimensionada ou quando
             * forem adicionados ou removidos links e nós da tela
             */
            function redraw() {

                console.log('redraw');

                outer
                    .attr('width', scope.width)
                    .attr('height', scope.height);

                allLinksGroup = allLinksGroup.data(scope.graph.getEdges());

                allLinksGroup.enter()
                    .append('g')
                    // TODO remove unnecessary code
                    .attr('class', 'linkgroup')
                    .classed('directed', scope.graph.isDirected())
                    .classed('undirected', !scope.graph.isDirected())
                    //.attr('id', function (d) { return 'link_' + d.source.label + '_' + d.target.label; })
                    .on('mousedown', mousedownlink)
                    .on('dblclick', function (d) {
                        // silence other listeners
                        d3.event.stopPropagation();
                        //edit the double clicked node
                        gpContainerCtrl.showLinkEditDialog(d, function(){
                            // TODO NÃO DEVE SER CHAMADA AQUI
                            //redraw();
                        });
                    })
                    .append('line')
                    .classed('link', true);



                var path_text = allLinksGroup.selectAll(".linkgroup")
                    .data(force.links())
                    .enter().append("text")
                    .attr("font-family", "Arial, Helvetica, sans-serif")
                    .attr("x", function(d) {
                        if (d.target.x > d.source.x) { return (d.source.x + (d.target.x - d.source.x)/2); }
                        else { return (d.target.x + (d.source.x - d.target.x)/2); }
                    })
                    .attr("y", function(d) {
                        if (d.target.y > d.source.y) { return (d.source.y + (d.target.y - d.source.y)/2); }
                        else { return (d.target.y + (d.source.y - d.target.y)/2); }
                    })
                    .attr("fill", "Black")
                    .style("font", "normal 12px Arial")
                    .attr("dy", ".35em")
                    .text(function(d) {
                        return d.peso;
                    });




                    //// TODO DUPLICANDO TEXTO EM TODOS OS LINKS
                    //.append("text")
                    //.attr("font-family", "Arial, Helvetica, sans-serif")
                    //.attr("x", function(d) {
                    //    if (d.target.x > d.source.x) { return (d.source.x + (d.target.x - d.source.x)/2); }
                    //    else { return (d.target.x + (d.source.x - d.target.x)/2); }
                    //})
                    //.attr("y", function(d) {
                    //    if (d.target.y > d.source.y) { return (d.source.y + (d.target.y - d.source.y)/2); }
                    //    else { return (d.target.y + (d.source.y - d.target.y)/2); }
                    //})
                    //.attr("fill", "Black")
                    //.style("font", "normal 12px Arial")
                    //.attr("dy", ".35em")
                    //.text(function(d) { return d.weight | 1; });

                allLinksGroup
                    .exit()
                    .remove();

                // use a custom function to get the key associated with the node
                allNodesGroup = allNodesGroup.data(scope.graph.getNodes(), function(d){return d.id;});

                updateSelections();

                nodeGroup = allNodesGroup.enter()
                    .append('g')
                        .attr('id', function (d, i) { return 'node-' + i; });

                nodeGroup
                    .attr('class', 'node')
                    .append('circle')
                    .attr('fill', function (d) { return d3.rgb(d.color).toString(); })
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
                            //TODO NÃO DEVE SER CHAMADA O REDRAW AQUI
                            //redraw();
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

                nodeGroup = allNodesGroup.select('g').attr('id', function (d, i) {
                    return 'node-' + i;
                });

                allNodesGroup.select('.node circle')
                    .attr('r', function(d){

                        /**
                         * TODO HIGH CPU
                         * alterar lógica para armazenar bbox e só alterar quando texto do nó for alterado
                         */
                        var texto = d3.select(this.parentNode).select('text')[0][0].getBBox() || 0;

                        if(texto.width > d.radius * 2){
                            d.radius = texto.width / 2 + 4;
                        }

                        return d.radius;

                    })
                    .attr('fill', function (d) {
                        return d3.rgb(d.color).toString();
                    });

                allNodesGroup.select('.node text').text(function (d) {
                    return d.label;
                });

                allLinksGroup
                    .select("text")

                    .attr("x", function(d) {
                        if (d.target.x > d.source.x) { return (d.source.x + (d.target.x - d.source.x)/2); }
                        else { return (d.target.x + (d.source.x - d.target.x)/2); }
                    })
                    .attr("y", function(d) {
                        if (d.target.y > d.source.y) { return (d.source.y + (d.target.y - d.source.y)/2); }
                        else { return (d.target.y + (d.source.y - d.target.y)/2); }
                    })

                    .text(function(d) { return 'não deveria estar aqui'; });
            }

            /**
             *
             * @param d
             * @param i
             */
            function dragMove(d, i) {
                console.log('dragMove');
                console.log(d);
                d.px += d3.event.dx;
                d.py += d3.event.dy;
                d.x += d3.event.dx;
                d.y += d3.event.dy;

                d3.select(this).attr('transform', function (d) {
                    //console.log('translate');
                    return 'translate(' + d.x + ',' + d.y + ')';
                });
                //scope.$apply();
            }

            /**
             * Faz o tratamento ao se clicar em algum link
             * @param d
             */
            function mousedownlink(d) {
                if (fab.currentOption === fab.fabOptions.remove) {
                    scope.$apply(function () {
                        scope.graph.removeEdge(d.source, d.target);
                        redraw();
                    });
                    toast.showSimpleToast('link removed!');
                }
            }

            /**
             * Faz o tratamento ao se clicar em algum nó.
             * @param d
             */
            function mousedownnode(d) {
                scope.$apply(function () {
                    gpContainerCtrl.setSelectedNode(d);
                });

                console.log('mouseDownNode');

                var self = this;

                //d3.event.stopPropagation(); // silence other listeners

                switch (fab.currentOption) {
                    case fab.fabOptions.remove:
                        scope.$apply(function () {

                            console.log('removing');
                            console.log(d);

                            scope.graph.removeNode(d);
                            gpContainerCtrl.updateNodeCount();
                            redraw();
                        });

                        toast.showSimpleToast('node removed!');
                        break;
                    case fab.fabOptions.info:
                        console.log(d);
                        break;
                    case fab.fabOptions.add.contextOptions[1]:

                        console.log('add link');

                        if (!scope.firstNode) {
                            scope.$apply(function () {
                                scope.firstNode = d;

                                    //TODO NÃO SERIA ESSE O SELECTNODE?
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

                                broadcastService.broadcast('new_message', 'Selecione nó destino.');
                            });
                        }
                        else if (scope.firstNode !== d) {

                            scope.$apply(function () {

                                //console.log(scope.firstNode);
                                //console.log(d);

                                scope.graph.addEdge(scope.firstNode, d);
                                delete scope.firstNode;

                                //console.log('broadcasting a');

                                //limpa as mensagens do contexto
                                broadcastService.broadcast('new_message', '');

                            });
                        }
                        break;
                }
                //TODO VERIFICAR NECESSIDADE DO REDRAW AQUI
                //redraw();
            }

            /**
             * Função chamada ao se iniciar o arrastar de um nó.
             * @param d
             * @param i
             */
            function dragStart(d, i) {
                // silence other listeners
                d3.event.sourceEvent.stopPropagation();
                console.log('dragStart');

                // inicia o force layout para a atualização da posição dos elementos do grafo
                force.start();
            }

            /**
             * Função chamada ao se finalizar o arrastar de um nó
             * @param d
             * @param i
             */
            function dragEnd(d, i) {
                scope.$apply();
                console.log('dragEnd');

                //previne de o force layout ficar rodando após os nós já terem sido movidos
                //force.stop();
            }

            /**
             * Desenha a grade na tela
             */
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

            /**
             * Função chamada ao se clicar no palco.
             */
            function clickedOnStage() {

                if (fab.currentOption === fab.fabOptions.add) {
                    var coordinates = d3.mouse(d3.event.target);

                    scope.graph.addNode({x: coordinates[0], y: coordinates[1], fixed: true, radius:15, color:d3.rgb(255,255,255)});
                    gpContainerCtrl.updateNodeCount();

                    scope.$apply();
                    toast.showSimpleToast('node added!');
                }
            }

            /**
             * Função chamada no evento tick do d3.js
             */
            function tick() {
                // Collision detection

                var nodes = scope.graph.getNodes();

                var q = d3.geom.quadtree(nodes),
                    i = 0,
                    n = nodes.length;

                while (++i < n){
                    q.visit(collide(nodes[i]));
                }


                /**
                 * Faz a colisão dos nós
                 * @param node
                 * @returns {Function}
                 */
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
                                l = (l - r) / l * 0.5;
                                node.x -= x *= l;
                                node.y -= y *= l;
                                quad.point.x += x;
                                quad.point.y += y;
                            }
                        }
                        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    };
                }

                allNodesGroup.attr('transform', function (d) {
                    //console.log('translate');
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

                allLinksGroup.select('line')
                    .attr('x1', function (d) { return d.source.x; })
                    .attr('y1', function (d) { return d.source.y; })
                    .attr('x2', function (d) { return d.target.x; })
                    .attr('y2', function (d) { return d.target.y; });

                allLinksGroup.select('text')
                    .attr("x", function (d) {
                        if (d.target.x > d.source.x) {
                            return (d.source.x + (d.target.x - d.source.x) / 2);
                        }
                        else {
                            return (d.target.x + (d.source.x - d.target.x) / 2);
                        }
                    })
                    .attr("y", function (d) {
                        if (d.target.y > d.source.y) {
                            return (d.source.y + (d.target.y - d.source.y) / 2);
                        }
                        else {
                            return (d.target.y + (d.source.y - d.target.y) / 2);
                        }
                    })
                    .text(function(d) { return d.weight || 1; });

                allNodesGroup.select('.node circle')
                    .attr('r', function(d){

                        /**
                         * TODO HIGH CPU
                         * alterar lógica para armazenar bbox e só alterar quando texto do nó for alterado
                         */


                        var texto = d3.select(this.parentNode).select('text')[0][0].getBBox() || 0;



                        if(texto.width > d.radius * 2){
                            d.radius = texto.width / 2 + 4;
                        }

                        return d.radius;

                    })
                    .attr('fill', function (d) {
                        return d3.rgb(d.color).toString();
                    });

                allNodesGroup.select('.node text').text(function (d) {
                    return d.label;
                });

                allNodesGroup.classed('node_selected', function (d) {
                    return d === selectedNode;
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

            scope.$on('select_node', selectNode);

            scope.$watch('graph', redraw, true);

            scope.$watch('graph.getNodes()', redraw);

            scope.$watch('graph.getLinks()', redraw);

            scope.$watch('fab.currentOption', function () {

                // Altera o estilo do mouseover dos nós de acordo com a opção atual.
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
                    case fab.fabOptions.add.contextOptions[1]:
                        broadcastService.broadcast('new_message', 'Selecione nó origem.');
                        break;
                }
                console.log('currentOption: ');
                console.log(fab.currentOption);
            });

            /**
             * Faz a inicialização do palco, do force layout e dos agrupamentos de nós e vértices.
             */
            function initSVG(){

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

            /**
             * Função de deseleção dos nós, incluindo animação de transição.
             * @param node
             */
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

            /**
             * Função de seleção de arestas, incluindo animação de inicio/fim.
             * @param source
             * @param target
             */
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

                var linkgroup = d3.select("svg #link-group");

                var path = linkgroup.append("path")
                    .attr("d", line(points));

                var arrow = linkgroup.append("path")
                    .style("fill", "none")
                    .style("stroke", "red")
                    .style("stroke-width", "red")
                    .attr("d", "M0, -5L10, 0L0, 5");

                var totalLength = path.node().getTotalLength() - 30;
                var animationTime = 1000;
                var currentPath = path.node();

                transition();

                // Faz a interpolação da linha que realçará a linha atual selecionada.
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

            /**
             * Função de seleção de nó.
             * @param node
             */
            function selectNode() {

                var node = broadcastService.object;

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

            /**
             * Função que ativa/desativa a opacidade dos links.
             */
            function toggleOpacityLinks() {
                d3.select('#link-group').selectAll('line')
                    .transition()
                    .duration(250)
                    .attr('opacity', 0.1);
            }
        }

        return directive;
    }


    /**
     * Controller da diretiva gpStage
     * @param $scope
     */
    function gpStageCtrl($scope) {
        var vm = this;

        //vm.selectNode = selectNode;
        //vm.selectLink = selectLink;
        //vm.deselectLink = deselectLink;
        //vm.deselectNode = deselectNode;
        //vm.toggleOpacityLinks = toggleOpacityLinks;


        /**
         * Função de deseleção dos links
         * @param source
         * @param target
         */
        //function deselectLink(source, target) {
        //    var link = '#link_' + source + '_' + target;
        //    d3.select(link)
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('stroke', 'black');
        //    //.style('stroke-width',5);
        //    console.log('exiting link :' + link);
        //}
        //
        ///**
        // * Função de deseleção dos nós, incluindo animação de transição.
        // * @param node
        // */
        //function deselectNode(node) {
        //    var selection = d3.selectAll('.node').filter(function (d, i) {
        //        return d.index === node.index;
        //    });
        //
        //    selection.select('circle')
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('fill', '#fff')
        //        .attr('r', function(d){ return d.radius;});
        //
        //    selection.select('text')
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('fill', '#000');
        //}
        //
        ///**
        // * Função de seleção de arestas, incluindo animação de inicio/fim.
        // * @param source
        // * @param target
        // */
        //function selectLink(source, target) {
        //    // Select the link based on source and target objects
        //    var selectedLink = d3.selectAll('.link').filter(function (d, i) {
        //        return d.source === source && d.target === target;
        //    }).data()[0];
        //
        //    if (selectedLink === undefined) {
        //        console.log('link doesnt exists! ' + source.label + ' ' + target.label);
        //        return;
        //    }
        //
        //    var points = [
        //        // start
        //        [selectedLink.source.x, selectedLink.source.y],
        //        // end
        //        [selectedLink.target.x, selectedLink.target.y]
        //    ];
        //
        //    var line = d3.svg.line()
        //        .x(function (d) { return d[0]; })
        //        .y(function (d) { return d[1]; })
        //        .interpolate('basis');
        //
        //    var linkgroup = d3.select("svg #link-group");
        //
        //    var path = linkgroup.append("path")
        //        .attr("d", line(points));
        //
        //    var arrow = linkgroup.append("path")
        //        .style("fill", "none")
        //        .style("stroke", "red")
        //        .style("stroke-width", "red")
        //        .attr("d", "M0, -5L10, 0L0, 5");
        //
        //    var totalLength = path.node().getTotalLength() - 30;
        //    var animationTime = 1000;
        //    var currentPath = path.node();
        //
        //    transition();
        //
        //    // Faz a interpolação da linha que realçará a linha atual selecionada.
        //    function transition() {
        //        arrow
        //            .transition()
        //            .duration(animationTime)
        //            .attrTween("transform", arrowTween);
        //        path
        //            .transition()
        //            .duration(animationTime)
        //            .attrTween('stroke-dasharray', tweenDash);
        //    }
        //
        //    function tweenDash() {
        //        return function (t) {
        //            var length = totalLength * t;
        //            return length + ',' + totalLength;
        //        };
        //    }
        //
        //    function arrowTween(d, i, a) {
        //        var t0 = 0;
        //        // time, between 0 and 1
        //        return function (t) {
        //            var pointAtLenght = currentPath.getPointAtLength(totalLength * t);
        //            //previous point
        //            var previousPosition = currentPath.getPointAtLength(totalLength * t0);
        //            //angle for tangent
        //            var angle = Math.atan2(pointAtLenght.y - previousPosition.y, pointAtLenght.x - previousPosition.x) * 180 / Math.PI;
        //            t0 = t;
        //
        //            return "translate(" + pointAtLenght.x + ',' + pointAtLenght.y + ')rotate(' + angle + ")";
        //        };
        //    }
        //}
        //
        ///**
        // * Função de seleção de nó.
        // * @param node
        // */
        //function selectNode() {
        //
        //    var node = broadcastService.object;
        //
        //    var selection = d3.selectAll('.node').filter(function (d, i) {
        //        return d.index === node.index;
        //    });
        //
        //    selection.select('circle')
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('fill', '#000000')
        //        .attr('r', function(d){
        //            return d.radius * 2;
        //        });
        //
        //    selection.select('text')
        //        .transition()
        //        .duration(250)
        //        //.ease('linear')
        //        .style('fill', '#ffffff');
        //}
        //
        ///**
        // * Função que ativa/desativa a opacidade dos links.
        // */
        //function toggleOpacityLinks() {
        //    d3.select('#link-group').selectAll('line')
        //        .transition()
        //        .duration(250)
        //        .attr('opacity', 0.1);
        //}
    }

})();
