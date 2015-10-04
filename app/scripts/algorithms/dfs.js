(function () {
    'use strict';

    angular.module('graphe.algorithms')
        .service('dfs', function () {
            var service = {};

            function next(){

            }

            function previous(){

            }

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
                ],
                stepList = [];



            function run(graph, visited) {

                if (typeof visited === "string") {
                    console.log('passed string');
                    visited = graph.getNode(visited);
                }

                service.instructions.push({instruction: 0, visited: visited});
                visited.marked = true;
                service.result.push(visited.label);
                service.instructions.push({instruction: 1, visited: visited});

                graph.adjacentList[visited.index].forEach(function (node) {
                    service.instructions.push({instruction: 2, visited: visited});
                    service.instructions.push({instruction: 3, visited: visited});

                    if (!node.marked) {
                        service.instructions.push({instruction: 4, visited: visited});
                        service.run(graph, node);
                    }
                });
            }

            service = {
                name: n,
                steps: steps,
                instructions: instructions,
                run: run,
                result: result
            };

            return service;
        });
})();