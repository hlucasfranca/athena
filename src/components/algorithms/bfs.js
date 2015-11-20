(function () {
    'use strict';
    angular.module('graphe.algorithms')
        .service('bfs', function () {

            var n = 'Breadth first search',
                instructions = [],
                result = [],
                steps = [],
                distTo = [],
                edgeTo =[];

            function run(G, v) {
                var node = G.getNode(v);
                result.push(node);
                bfs(G, node);

                G.getNodes().forEach(function(node){
                    delete node.marked;
                });

                return result;
            }

            function bfs(G, s) {
                var q = [];

                G.getEdges().forEach(function(element,index){
                    distTo[index] = Infinity;
                });

                distTo[s] = 0;
                s.marked = true;

                q.push(s);

                while (q.length !== 0) {
                    var v = q.pop();

                    G.getAdjacencyList(v).forEach(function(w){
                        if (!w.marked) {
                            result.push(w);
                            edgeTo[w.id] = v;
                            distTo[w.id] = distTo[v] + 1;
                            w.marked = true;
                            q.push(w);
                        }
                    });
                }
            }

            //noinspection UnnecessaryLocalVariableJS
            var service = {
                name: n,
                steps: steps,
                result: result,
                instructions: instructions,
                run: run
            };

            return service;
        });
})();