angular.module('graphe.model')
    .factory('model', ['colors', 'labels', model]);

    function model(colors, labels) {
        'use strict';

        var service = {
            getGraph: getGraph
        };

        return service;

        function getGraph(v){
            labels.restart();
            return new Graph(v);
        }


        function Graph(v) {
            var model = this;

            model.addNode = addNode;
            model.addEdge = addEdge;

            model.getNodes = getNodes;
            model.getEdges = getEdges;
            model.getNode = getNode;

            model.removeNode = removeNode;
            model.removeLink = removeLink;
            model.removeLinksForNode = removeLinksForNode;

            model.updateAdjacencyMatrix = updateAdjacencyMatrix;
            model.spliceLinksForNode = spliceLinksForNode;

            model.getAdjacentMatrix = getAdjacentMatrix;
            model.getAdjacentList = getAdjacentList;

            model.getAdjacentNodes = getAdjacentNodes;
            model.getIncidentNodes = getIncidentNodes;

            model.nodes = 0;
            model.edges = 0;
            model.adjacentList = [];
            model.nodeList = [];
            model.edgeList = [];
            model.matrix = [];

            for (var i = 0; i < v; i++) {
                this.addNode(Math.random() * 400,Math.random() * 400);
            }

            /**
             * Function definitions
             */

            function getAdjacentMatrix () {
                return model.matrix;
            }

            function getAdjacentList () {
                return model.adjacentList;
            }

            /* Get a node by its label */
            function getNode( label ){
                var node = null;

                model.nodeList.forEach(function(element){
                    if( element.label === label){
                        console.log('found!');
                        node = element;
                    }
                });
                
                return node;
            }

            function getAdjacentNodes( index ){
                var adjacentNodes = [];

                if(model.matrix[index] !== undefined){
                    for(var i = 0; i < model.matrix[index].length; i++){
                        if(model.matrix[i] !== 0){
                            adjacentNodes.push(model.getNodes()[i]);
                        }
                    }
                }

                return adjacentNodes;
            }

            function getIncidentNodes(index){
                return [];
            }

            function removeLinksForNode(node) {

                // Gets only the edges starting or ending in node
                var toSplice = model.edgeList.filter(function(edge) {
                    return (edge.source.index === node.index || edge.target.index === node.index);
                });

                // Remove the edges from the edgeList
                var removedEdges = toSplice.map(function(edge) {

                    //Gets the position of the edge in the edgeList
                    var indexToRemove = model.edgeList.indexOf(edge);

                    model.edgeList.splice(indexToRemove, 1);
                });

                console.log('Removed edges: ');
                console.log(removedEdges);
            }

            function removeNode (n){
                // updates the adjacency list
                model.adjacentList.forEach(function(element, index){

                    // get the node
                    var toSplice = model.adjacentList[index].filter( function (data) {
                        return n.index === data.index;
                    });

                    // remove the node
                    var removed = toSplice.map(function (data) {
                        model.adjacentList[index].splice(model.adjacentList[index].indexOf(data), 1);
                    });
                });

                model.adjacentList.splice(n.index,1);
                model.nodeList.splice(n.index,1);
                model.removeLinksForNode(n);
                model.nodes--;

                // updates the adjacency matrix
                model.matrix.forEach(function(element, index){
                    model.matrix[index].splice(n.index,1);
                });

                model.matrix.splice(n.index,1);
            }

            function removeLink (d){
                console.log('removing link');
            }

            function getEdges () {
                return model.edgeList;
            }

            function addNode (xPosition, yPosition) {
                // as index is zero-based, use the nodes number before increment
                var len = model.nodeList.length;

                var newNode = {
                    name: 'dummy node',
                    x: xPosition !== undefined ? xPosition : Math.random() * 200,
                    y: yPosition !== undefined ? yPosition : Math.random() * 200,
                    fixed: true,
                    color: colors.getColor(),
                    label: labels.getLetter(),
                    index: len,
                    marked: false
                };

                model.nodeList.push(newNode);
                model.adjacentList[len] = [];
                //this.adjacentList[this.nodes].push(newNode);
                //this.marked[this.nodes] = false;
                model.nodes++;
                model.updateAdjacencyMatrix();
            }

            function updateAdjacencyMatrix () {
                model.matrix = [];
                var numberOfNodes = model.nodeList.length;

                if(numberOfNodes > 0){

                    model.nodeList.forEach(function(node, i) {
                        model.matrix[i] = d3.range(numberOfNodes).map(function() { return {value: 0}; });
                    });

                    model.edgeList.forEach(function(link){
                        /*
                         Using id beause of:

                         (...)

                         Note: the values of the source and target attributes may be initially specified as indexes into
                         the nodes array; these will be replaced by references after the call to start.

                         (...)

                         https://github.com/mbostock/d3/wiki/Force-Layout#links
                         */
                        model.matrix[link.source.index][link.target.index].value = 1;
                        model.matrix[link.target.index][link.source.index].value = 1;
                    });
                }
            }

            function addEdge (v, w) {

                if($.inArray(model.nodeList[w], model.adjacentList[v]) === -1){
                    model.adjacentList[v].push(model.nodeList[w]);

                    model.edgeList.push({
                        source: model.nodeList[v],
                        target: model.nodeList[w]
                    });

                    model.edges++;
                    model.updateAdjacencyMatrix();
                }

            }

            function getNodes () {
                return model.nodeList;
            }

            function spliceLinksForNode (node) {

                var toSplice = model.edgeList.filter(
                    function (link) {
                        return (link.source === node) || (link.target === node);
                    });

                toSplice.map(function (link) {
                    model.edgeList.splice(model.edgeList.indexOf(link), 1);
                });
            }
        }

    }


