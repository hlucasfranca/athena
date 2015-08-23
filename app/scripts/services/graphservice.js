

/**
 * @ngdoc service
 * @name grapheApp.GraphService
 * @description
 * # GraphService
 * Service in the grapheApp.
 */
angular.module('grapheApp')
    .service('GraphService', function () {
        'use strict';

        // AngularJS will instantiate a singleton by calling "new" on this function

        var materialColors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F', '#03A9F4', '#00BCD4',
            '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548',
            '#9E9E9E', '#607D8B'];

        var materialColor = d3.scale.ordinal().range(materialColors);

        function getColor(){
            var index = Math.floor(Math.random() * materialColors.length);
            var color = materialColor(index);
            console.log(color);
            return color;
        }

        var letter = 'A';
        var nodeCounter = 1;

        function nextChar(c) {
            return String.fromCharCode(c.charCodeAt(0) + 1);
        }

        function getLetter(){
            var temp = letter;
            letter = nextChar(letter);

            return temp;
        }

        function Graph(v) {

            this.getAdjacentMatrix = function () {
                return this.matrix;
            };

            this.getAdjacentList = function () {
                return this.adjacentList;
            };

            this.removeLinksForNode = function (node) {
                // Without 'self', the inner functions don't work.
                var self = this;

                var toSplice = this.linkList.filter(function(l) {
                    return (l.source.index === node.index || l.target.index === node.index);
                });

                toSplice.map(function(l) {
                    var indexToRemove = self.linkList.indexOf(l);
                    self.linkList.splice(indexToRemove, 1);
                });
            };

            this.removeNode = function (d){

                var self = this;

                // updates the adjacency list
                this.adjacentList.forEach(function(element, index){

                    // get the node
                    var toSplice = self.adjacentList[index].filter( function (data) {
                            return d.index === data.index;
                        });

                    // remove the node
                    toSplice.map(function (data) {
                        self.adjacentList[index].splice(self.adjacentList[index].indexOf(data), 1);
                    });
                });

                this.adjacentList.splice(d.index,1);

                //this.marked.splice(d.index,1);
                this.nodeList.splice(d.index,1);
                this.removeLinksForNode(d);
                this.nodes--;

                // updates the adjacency matrix
                this.matrix.forEach(function(element, index){
                    self.matrix[index].splice(d.index,1);
                });

                this.matrix.splice(d.index,1);
            };

            this.getLinks = function () {
                return this.linkList;
            };

            this.addNode = function (xPosition, yPosition) {
                // as index is zero-based, use the nodes number before increment

                var len = this.nodeList.length;

                var newNode = {
                    name: 'dummy node',
                    x: xPosition !== undefined ? xPosition : Math.random() * 200,
                    y: yPosition !== undefined ? yPosition : Math.random() * 200,
                    fixed: true,
                    color: getColor(),
                    label: getLetter(),
                    index: len,
                    marked: false
                };

                this.nodeList.push(newNode);
                this.adjacentList[this.nodes] = [];
                //this.adjacentList[this.nodes].push(newNode);
                //this.marked[this.nodes] = false;
                this.nodes++;
                this.updateAdjacencyMatrix();
            };

            this.updateAdjacencyMatrix = function () {

                var self = this;

                this.matrix = [];
                var n = this.nodeList.length;

                if(n > 0){

                    this.nodeList.forEach(function(node, i) {
                        self.matrix[i] = d3.range(n).map(function() { return {value: 0}; });
                    });

                    this.linkList.forEach(function(link){
                        /*
                            Using id beause of:

                          (...)

                         Note: the values of the source and target attributes may be initially specified as indexes into
                         the nodes array; these will be replaced by references after the call to start.

                         (...)

                         https://github.com/mbostock/d3/wiki/Force-Layout#links
                        */
                        self.matrix[link.source.index][link.target.index].value = 1;
                        self.matrix[link.target.index][link.source.index].value = 1;
                    });
                }
            };

            this.addEdge = function (v, w) {

                if($.inArray(this.nodeList[w], this.adjacentList[v]) === -1){
                    this.adjacentList[v].push(this.nodeList[w]);

                    this.linkList.push({
                        source: this.nodeList[v],
                        target: this.nodeList[w]
                    });

                    this.edges++;
                    this.updateAdjacencyMatrix();
                }

                /*if($.inArray(this.nodeList[v], this.adjacentList[w]) === -1){
                    this.adjacentList[w].push(this.nodeList[v]);
                }*/


            };

            this.getNodes = function () {
                return this.nodeList;
            };

            this.spliceLinksForNode = function (node) {

                var self = this;

                var toSplice = this.linkList.filter(
                    function (link) {
                        return (link.source === node) || (link.target === node);
                    });

                toSplice.map(function (link) {
                    self.linkList.splice(self.linkList.indexOf(link), 1);
                });
            };

            /**
             * Initialize the number of vertices
             */
            this.nodes = 0;
            this.edges = 0;
            this.adjacentList = [];
            this.nodeList = [];
            this.linkList = [];
            this.matrix = [];
            //this.marked = [];

            for (var i = 0; i < v; i++) {
                this.addNode(Math.random() * 400,Math.random() * 400);
                //this.marked[i] = false;
            }
        }

        this.getGraph = function (numberOfNodes) {
            return new Graph(numberOfNodes);
        };

    });
