(function () {
    'use strict';
    angular.module('graphe.algorithms')
        .service('bfs', function () {

            /**
             * Percurso em largura, adaptado de handbook of graph theory
             * 2.1.2
             * @type {string}
             */

            var n = 'Percurso em largura',
                instructions = [],
                result = [],
                steps = [
                    "Visita-se um n� n previamente selecionado;",
                    "Marca o n� n",
                    "Inserir n em uma fila F",
                    "Enquanto a fila F n�o estiver vazia",
                    "Retira um elemento da fila F e atribui ao n� n",
                    "Para cada n� m n�o marcado e adjacente a n fa�a",
                    "O n� m � visitado",
                    "O n� m � colocado na fila F",
                    "O n� m � marcado"
                ];

            /**
             * @param  {Graph} graph The graph to be visited
             * @param  {Node} visited The initial node.
             */
            function run(graph, visited) {
                console.log('starting algorithm');

                var node = graph.getNode(visited);



                bfs(graph, node);
                console.log('end of algorithm');

                console.log(result);
                return result;
            }

            /**
             *
             * @param G
             * @param v
             */
            function bfs(G, verticeInicial) {
                //temporary flag

                var fila = [];
                verticeInicial.marked = true;

                // Adiciona � fila
                fila.push(verticeInicial);

                while (fila.length > 0) {
                    //Pega primeiro item da fila
                    var n = fila.shift();
                    if (n) {
                        console.log("Visited vertex: ");
                        console.log(n);
                        result.push(n);
                    }

                    G.getAdjacencyList(n).forEach(function(m){
                        if (!m.marked) {
                            m.marked = true;
                            fila.push(m);
                            console.log(fila);
                        }
                    });
                }

                G.getNodes().forEach(function(vertice){
                    if(angular.isDefined(vertice.marked)) {
                        delete vertice.marked;
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