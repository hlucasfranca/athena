(function () {
    'use strict';

    angular.module('graphe.algorithms')
        .service('coloracaoClasse', function () {

            var n = 'Coloração por classe',
                instructions = [],
                result = [],
                steps = [

                ];

            function run(graph, visited) {
                console.log('iniciando coloração por classe');

                var vertice = graph.getNode(visited);

                coloracaoClasse(graph, vertice);
                console.log('fim: coloração por classe');

                console.log(result);
                return result;
            }

            /**
             * Algoritmo CC (G)

             para i = 1 até n faça
                 Ci = []
             fim-para

             Y = X
             k = 1;

             enquanto Y != [] faça

                 para xi E Y faça
                     se Vizinhos(xi) interseção Ck == []
                         Ck = Ck U {xi}
                         Y = Y - {xi}
                     fim-se
                 fim-para

                 k = k + 1;

             fim-enquanto
             */
            function coloracaoClasse(G, v) {

                var nos = G.getNodes();
                var C = [];
                var i;

                for(i = 0; i < nos.length; i++ ){
                    C[i] = [];
                }

                var Y = nos.slice();
                var k = 1;

                while(Y.length > 0){

                    for(i = 0; i < Y.length; i++ ){

                        //TODO APENAS VIZINHOS QUE JÁ NÃO FORAM EXCLUIDOS
                        var vizinhos = G.getNeighboors(Y[i]);
                        var contem = false;
                        // verifica se algum dos vizinhos já esta no conjunto
                        // de cores
                        C[k].forEach(function (cor) {
                            vizinhos.forEach(function (vizinho) {
                                if (vizinho === cor) {
                                    contem = true;
                                }
                            });
                        });

                        if(!contem){
                            C[k].push(Y[i]);
                            Y.splice(i,1);
                        }
                    }
                    k++;
                }
                console.log(C);
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