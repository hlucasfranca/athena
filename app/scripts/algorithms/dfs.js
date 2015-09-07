'use strict';

/**
 * @ngdoc service
 * @name app.algorithmService
 * @description
 * # algorithmService
 * Service in the app.
 */
angular.module('graphe.algorithms')
    .service('dfs', function () {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var service = this;

        service.name = 'Depth first search';

        service.steps = [
            'procedure DFS(G,v):',
            'label v as discovered',
            'for all edges from v to w in G.adjacentEdges(v) do',
            'if vertex w is not labeled as discovered then',
            'recursively call DFS(G,w)',
            'end of algorithm'
        ];

        service.instructions = [];
        service.result = [];

        service.depthSearch = depthSearch;
        service.run = run;

        

        /*
        *  Method definitions
        * */

        function depthSearch(graph, visited, dfsSteps){

            dfsSteps.push({ instruction: 0, visited: visited });
            visited.marked = true;
            dfsSteps.push({ instruction: 1, visited: visited });

            graph.adjacentList[visited.index].forEach(function(node){
                dfsSteps.push({ instruction: 2, visited: visited });
                dfsSteps.push({ instruction: 3, visited: visited });

                if (!node.marked) {
                    dfsSteps.push({ instruction: 4, visited: visited });
                    service.run(graph, node, dfsSteps);
                }
            });

            dfsSteps.push({ instruction: 5, visited: visited });

            // clean markers
            graph.getNodes().forEach(function(element){
                element.marked = false;
            });
        }

         function run(graph, visited){
            service.instructions.push({ instruction: 0, visited: visited });
            visited.marked = true;
            service.result.push(visited.label);
            service.instructions.push({ instruction: 1, visited: visited });

            graph.adjacentList[visited.index].forEach(function(node){
                service.instructions.push({ instruction: 2, visited: visited });
                service.instructions.push({ instruction: 3, visited: visited });

                if (!node.marked) {
                    service.instructions.push({ instruction: 4, visited: visited });
                    service.run(graph, node);
                }
            });


        }
    });
