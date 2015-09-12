/**
 * @ngdoc service
 * @name app.data
 * @description
 * # GraphService
 * Service in the app.
 */
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
            model.getLinks = getLinks;
            model.getNode = getNode;

            model.removeNode = removeNode;
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
            model.linkList = [];
            model.matrix = [];

            for (var i = 0; i < v; i++) {
                this.addNode(Math.random() * 400,Math.random() * 400);
            }

            //model.links = model.getLinks;
            //model.nodes = model.getNodes;

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
                var toSplice = model.linkList.filter(function(l) {
                    return (l.source.index === node.index || l.target.index === node.index);
                });

                toSplice.map(function(l) {
                    var indexToRemove = model.linkList.indexOf(l);
                    model.linkList.splice(indexToRemove, 1);
                });
            }

            function removeNode (d){
                // updates the adjacency list
                model.adjacentList.forEach(function(element, index){

                    // get the node
                    var toSplice = model.adjacentList[index].filter( function (data) {
                        return d.index === data.index;
                    });

                    // remove the node
                    toSplice.map(function (data) {
                        model.adjacentList[index].splice(model.adjacentList[index].indexOf(data), 1);
                    });
                });
                model.adjacentList.splice(d.index,1);
                model.nodeList.splice(d.index,1);
                model.removeLinksForNode(d);
                model.nodes--;

                // updates the adjacency matrix
                model.matrix.forEach(function(element, index){
                    model.matrix[index].splice(d.index,1);
                });

                model.matrix.splice(d.index,1);
            }

            function getLinks () {
                return model.linkList;
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

                    model.linkList.forEach(function(link){
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

                    model.linkList.push({
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

                var toSplice = model.linkList.filter(
                    function (link) {
                        return (link.source === node) || (link.target === node);
                    });

                toSplice.map(function (link) {
                    model.linkList.splice(model.linkList.indexOf(link), 1);
                });
            }
        }

    }


