(function () {
    'use strict';

    angular.module('graphe.algorithms')
        .service('dfs', function () {

            var n = 'Depth first search',
                instructions = [],
                result = [],
                steps = [
                    'procedure DFS(G,v):',
                    'label v as discovered',
                    'for all edges from v to w in G.adjacentEdges(v) do',
                    'if vertex w is not labeled as discovered then',
                    'recursively call DFS(G,w)',
                    'end of algorithm'
                ];

            /**
             * @param  {Graph} graph The graph to be visited
             * @param  {Node} visited The initial node.
             */
            function run(graph, visited) {
                console.log('starting algorithm');

                var node = graph.getNode(visited);

                result.push(node);

                dfs(graph, node);
                console.log('end of algorithm');

                console.log(result);
                return result;
            }

            /**
             *
             * @param G
             * @param v
             */
            function dfs(G, v) {
                //temporary flag

                v.marked = true;

                instructions.push({
                    visited: v,
                    instruction: 0
                });

                G.getAdjacencyList(v).forEach(function(node){
                    if(!node.marked){
                        instructions.push({
                            visited: v,
                            instruction: 1
                        });
                        result.push(node);
                        dfs(G,node);
                    }
                });

                // clean up flag
                delete v.marked;
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