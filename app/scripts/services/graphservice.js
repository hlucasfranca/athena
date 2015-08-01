

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

            for (var i = 0; i < this.nodes; ++i) {
                this.adjascentList[i] = [];
                this.adjascentList[i].push("");
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


            function addNode() {
                // as index is zero-based, use the nodes number before increment
                this.adjascentList[this.nodes] = [];
                this.adjascentList[this.nodes].push("");
                this.marked[this.nodes] = false;

                this.nodes++;
            }

            function addEdge(v, w) {
                this.adjascentList[v].push(w);
                this.adjascentList[w].push(v);
                this.edges++;
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
