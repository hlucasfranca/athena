(function () {
    'use strict';
    angular.module('graphe.algorithms')
        .service('bfs', function () {

            /**
             * Percurso em largura, adaptado de handbook of graph theory
             * 2.1.2
             * @type {string}
             */

            var nome = 'Percurso em largura',
                instrucoes = [],
                resultado = [],
                passos = [
                    "Visita-se um nó n previamente selecionado;",
                    "Marca o nó n",
                    "Inserir n em uma fila F",
                    "Enquanto a fila F não estiver vazia",
                    "        Retira um elemento da fila F e atribui ao nó n",
                    "        Para cada nó m não marcado e adjacente a n faça",
                    "                O nó m é visitado",
                    "                O nó m é colocado na fila F",
                    "                O nó m é marcado",
                    "Fim do algoritmo"
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
                console.log(resultado);
                return resultado;
            }

            /**
             *
             0"Visita-se um nó n previamente selecionado;",
             1"Marca o nó n",
             2"Inserir n em uma fila F",
             3"Enquanto a fila F não estiver vazia",
             4"        Retira um elemento da fila F e atribui ao nó n",
             5"        Para cada nó m não marcado e adjacente a n faça",
             6"                O nó m é visitado",
             7"                O nó m é colocado na fila F",
             8"                O nó m é marcado"
             ];
             *
             *
             *
             */
            function bfs(G, verticeInicial) {
                //temporary flag

                var fila = [];
                var resultadoFinal = [];
                verticeInicial.marcado = true;
                resultado.push({ operacao: 'visitar_no', passo: 0, fila: [], item: verticeInicial, resultado:resultadoFinal.slice() });
                resultado.push({ operacao: 'marcar_no', passo: 1, fila: [], item: verticeInicial, resultado:resultadoFinal.slice() });

                // Adiciona à fila
                fila.push(verticeInicial);
                resultado.push({ operacao: '', passo: 2, fila: fila.slice(), resultado:resultadoFinal.slice() });

                while (fila.length > 0) {
                    resultado.push({ operacao: '', passo: 3, fila: fila.slice(), resultado:resultadoFinal.slice() });
                    //Pega primeiro item da fila
                    var n = fila.shift();
                    resultadoFinal.push(n);
                    resultado.push({ operacao: '', passo: 4, fila: fila.slice(), resultado:resultadoFinal.slice()  });


                    G.getAdjacencyList(n).forEach(function(m){
                        resultado.push({ operacao: '', passo: 5, fila: fila.slice(),resultado: resultadoFinal.slice() });
                        if (!m.marcado) {
                            m.marcado = true;
                            resultado.push({ operacao: 'visitar_no', passo: 6, fila:fila.slice(), item:m, resultado:resultadoFinal.slice() });
                            fila.push(m);
                            resultado.push({ operacao: '', passo: 7, fila:fila.slice(), resultado:resultadoFinal.slice() });
                            resultado.push({ operacao: 'marcar_no', passo: 8, fila:fila.slice(), item:m,resultado:resultadoFinal.slice() });
                        }
                    });
                }

                resultado.push({ operacao: '', passo: 9, fila:fila.slice(),resultado:resultadoFinal.slice() });

                G.getNodes().forEach(function(vertice){
                    if(angular.isDefined(vertice.marcado)) {
                        delete vertice.marcado;
                    }
                });
            }

            //noinspection UnnecessaryLocalVariableJS
            var service = {
                name: nome,
                steps: passos,
                result: resultado,
                instructions: instrucoes,
                run: run,
                usaFila : true
            };

            return service;
        });
})();