

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

            /**
             * Initialize the number of vertices
             */

            function getAdjacentMatrix(){
                return this.matrix;
            }

            function getAdjacentList(){
                return this.adjacentList;
            }

            function removeLinksForNode(node){
                // Without 'self', the inner functions don't work.
                var self = this;

                var toSplice = self.linkList.filter(function(l) {
                    return (l.source.index === node.index || l.target.index === node.index);
                });

                toSplice.map(function(l) {
                    var indexToRemove = self.linkList.indexOf(l);
                    self.linkList.splice(indexToRemove, 1);
                });
            }

            function removeNode(d){
                var self = this;
                self.adjacentList.splice(d.index,1);
                self.marked.splice(d.index,1);
                self.nodeList.splice(d.index,1);
                removeLinksForNode.call(self, d);
                self.nodes--;
                updateAdjacencyMatrix.call(self);
            }

            function getLinks(){
                return this.linkList;
            }

            function addNode(xPosition, yPosition) {

                var self = this;

                // as index is zero-based, use the nodes number before increment
                self.adjacentList[self.nodes] = [];
                self.adjacentList[self.nodes].push("");
                self.marked[self.nodes] = false;

                var len = self.nodeList.length;

                self.nodeList.push(
                    {
                        name: 'dummy node',
                        x: xPosition !== undefined ? xPosition : Math.random() * 200,
                        y: yPosition !== undefined ? yPosition : Math.random() * 200,
                        fixed: true,
                        color: getColor(),
                        label: getLetter(),
                        index: len
                    }
                );
                self.nodes++;
                updateAdjacencyMatrix.call(this);
            }

            function updateAdjacencyMatrix(){

                var self = this;
                self.matrix = [];
                var n = self.nodeList.length;

                if(n > 0){

                    self.nodeList.forEach(function(node, i) {
                        self.matrix[i] = d3.range(n).map(function() { return {value: 0}; });
                    });

                    self.linkList.forEach(function(link){
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
            }


            function addEdge(v, w) {
                var self = this;

                self.adjacentList[v].push(w);
                self.adjacentList[w].push(v);

                self.linkList.push({
                    source: self.nodeList[v],
                    target: self.nodeList[w]
                });

                self.edges++;
                updateAdjacencyMatrix.call(self);
            }

            function getNodes(){
                return this.nodeList;
            }

            function showGraph() {
                var self = this;
                var output = "";

                for (var i = 0; i < self.nodes; ++i) {
                    output += i + " -> ";

                    for (var j = 0; j < self.nodes; ++j) {
                        if (self.adjacentList[i][j] !== undefined) {
                            output += self.adjacentList[i][j] + ' ';
                        }
                    }
                   output += '\n';
                }
                console.log(output);
            }

            function depthFirstSearch(v) {

                var self = this;

                self.marked[v] = true;

                if (self.adjacentList[v] !== undefined) {
                    console.log("Visited vertex: " + v);
                }

                for (var i = 0; i < self.adjacentList[v].length; i++) {
                    if (!self.marked[i]) {
                        self.depthFirstSearch(i);
                    }
                }
            }

            /*
                Object definition
            */
            if (v !== undefined) {
                this.nodes = v;
            } else {
                this.nodes = 0;
            }

            this.edges = 0;
            this.adjacentList = [];
            this.nodeList = [];
            this.linkList = [];
            this.matrix = [];

            for (var i = 0; i < this.nodes; ++i) {
                this.adjacentList[i] = [];
                this.adjacentList[i].push("");

                // TODO: use addNode here too.

                var letter = getLetter();
                var len = this.nodeList.length;

                this.nodeList.push(
                    {
                        name: letter,
                        x: Math.random() * 400,
                        y: Math.random() * 400,
                        fixed: true,
                        color: getColor(),
                        label: letter,
                        index: len
                    }
                );
            }

            this.marked = [];

            for (var j = 0; j < this.nodes; ++j) {
                this.marked[j] = false;
            }

            /**
             * Method Definitions
             */
            this.addEdge = addEdge;
            this.showGraph = showGraph;
            this.depthFirstSearch = depthFirstSearch;
            this.addNode = addNode;
            this.getNodes = getNodes;
            this.getLinks = getLinks;
            this.removeNode = removeNode;
            this.removeLinksForNode = removeLinksForNode;
            this.getAdjacentList = getAdjacentList;
            this.getAdjacentMatrix = getAdjacentMatrix;
        }

        this.getGraph = function (numberOfNodes) {
            var g = new Graph(numberOfNodes);
            return g;
        };

    });
