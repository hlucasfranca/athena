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

            function run(graph, visited) {



                console.log('starting algorithm');

                dfs(graph,visited);

                instructions.push({instruction: steps.length - 1, visited: visited});

                console.log('end of algorithm');
            }

            function dfs(graph, visited) {
                var node = visited;

                if (typeof visited === 'string') {
                    console.log('passed string');
                    node = graph.getNode(visited);
                }

                           instructions.push({instruction: 0, visited: node});
                node.marked = true;
                         result.push(node.label);
                       instructions.push({instruction: 1, visited: node});

                graph.adjacentList[node.index].forEach(function (n) {
                             instructions.push({instruction: 2, visited: node});
                           instructions.push({instruction: 3, visited: node});

                    if (!n.marked) {
                                 instructions.push({instruction: 4, visited: node});
                        dfs(graph, n);
                    }
                });
            }


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