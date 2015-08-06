

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

        var materialColors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F", "#03A9F4",
            "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
            "#795548", "#9E9E9E", "#607D8B"];

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
            var temp = nextChar(letter);
            letter = nextChar(letter);

            return temp;
        }

        function Graph(v) {

            /**
             * Initialize the number of vertices
             */

            if (v !== undefined) {
                this.nodes = v;
            } else {
                this.nodes = 1;
            }

            this.edges = 0;

            this.adjascentList = [];

            this.nodeList = [];

            this.linkList = [];

            for (var i = 0; i < this.nodes; ++i) {
                this.adjascentList[i] = [];
                this.adjascentList[i].push("");

                // TODO: use addNode here too.
                this.nodeList.push(
                    {
                        name: 'dummy node',
                        x: Math.random() * 400,
                        y: Math.random() * 400,
                        fixed: true,
                        color: getColor(),
                        label: getLetter(),
                        counter: nodeCounter++
                        
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
                console.log(d);
                this.adjascentList.splice(d.index,1);
                this.marked.splice(d.index,1);
                this.nodeList.splice(d.index,1);


                removeLinksForNode.call(this, d);
                this.nodes--;
            }

            function getLinks(){
                return this.linkList;
            }


            function addNode(xPosition, yPosition) {
                // as index is zero-based, use the nodes number before increment
                this.adjascentList[this.nodes] = [];
                this.adjascentList[this.nodes].push("");
                this.marked[this.nodes] = false;

                console.log(xPosition + ' ' + yPosition);

                this.nodeList.push(
                    {
                        name: 'dummy node',
                        x: xPosition !== undefined ? xPosition : Math.random() * 200,
                        y: yPosition !== undefined ? yPosition : Math.random() * 200,
                        fixed: true,
                        color: getColor(),
                        label: getLetter(),
                        counter: nodeCounter++
                    }
                );

                this.nodes++;
            }

            function addEdge(v, w) {
                this.adjascentList[v].push(w);
                this.adjascentList[w].push(v);

                this.linkList.push({
                    source: v,
                    target: w
                });

                this.edges++;
            }

            function getNodes(){
                return this.nodeList;
            }

            function showGraph() {

                var output = "";

                for (var i = 0; i < this.nodes; ++i) {

                    output += i + " -> ";

                    for (var j = 0; j < this.nodes; ++j) {
                        if (this.adjascentList[i][j] !== undefined) {
                            output += this.adjascentList[i][j] + ' ';
                        }

                    }
                   output += '\n';
                }

                console.log(output);
            }

            function depthFirstSearch(v) {
                this.marked[v] = true;

                if (this.adjascentList[v] !== undefined) {
                    console.log("Visited vertex: " + v);
                }

                for (var i = 0; i < this.adjascentList[v].length; i++) {
                    if (!this.marked[i]) {
                        this.depthFirstSearch(i);
                    }
                }
            }
        }

        this.getGraph = function (numberOfNodes) {
            var g = new Graph(numberOfNodes);
            return g;
        };

    });
