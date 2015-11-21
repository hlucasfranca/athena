(function () {
    'use strict';

    /**
     * Algoritmo depth first search, adaptado de handbook of graph theory
     *  seção 2.1.2
     */

    angular.module('graphe.algorithms')
        .service('dfs', function () {

            var n = 'Busca em profundidade',
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
                result = [];

                console.log('starting dfs');

                var node = graph.getNode(visited);

                result.push(node);

                dfs(graph, node);

                console.log('end of dfs');

                console.log(result);

                // remove flag auxiliar
                graph.getNodes().forEach(function(vertice){
                    if(angular.isDefined(vertice.marcado)){
                        delete vertice.marcado;
                    }
                });

                return result;
            }

            function dfs(G, v) {
                //flag auxiliar
                v.marcado = true;

                console.log('marcando');
                console.log(v.label);
                var listaAdjacencia = G.getAdjacencyList(v);

                console.log('listaAdjacencia');
                console.log(listaAdjacencia);

                listaAdjacencia.forEach(function(vertice){
                    if(!vertice.marcado){
                        result.push(vertice);
                        console.log('visitando');
                        console.log(vertice.label);
                        dfs(G, vertice);
                    }
                });
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