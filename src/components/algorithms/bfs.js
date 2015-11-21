(function () {
    'use strict';
    angular.module('graphe.algorithms')
        .service('bfs', function () {

            var n = 'Percurso em largura',
                instructions = [],
                result = [],
                steps = [
                    "Visita-se um nó n previamente selecionado;",
                    "Marca o nó n",
                    "Inserir n em uma fila F",
                    "Enquanto a fila F não estiver vazia",
                    "Retira um elemento da fila F e atribui ao nó n",
                    "Para cada nó m não marcado e adjacente a n faça",
                    "O nó m é visitado",
                    "O nó m é colocado na fila F",
                    "O nó m é marcado"
                ],
                distTo = [],
                edgeTo =[];

            /**
             * @param  {Graph} graph The graph to be visited
             * @param  {Node} visited The initial node.
             */
            function run(graph, visited) {
                console.log('starting algorithm');

                var node = graph.getNode(visited);

                result.push(node);

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

                var pilha = [];
                verticeInicial.marked = true;

                // Adiciona à pilha
                pilha.push(verticeInicial);

                while (pilha.length > 0) {
                    //Popa da pilha
                    var verticeVisitado = pilha.shift();
                    if (verticeVisitado) {
                        console.log("Visited vertex: ");
                        console.log(verticeVisitado);
                    }

                    G.getAdjacencyList(verticeInicial).forEach(function(verticeAdjacente){
                        if (!verticeAdjacente.marked) {
                            verticeAdjacente.marked = true;
                            pilha.push(verticeAdjacente);
                            console.log('pilha');
                            console.log(pilha);
                        }
                    });
                }

                delete verticeInicial.marked;
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