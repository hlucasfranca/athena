(function () {
    'use strict';

    angular.module('graphe.algorithms')
        .service('coloracaoSequencial', function () {

            var n = 'Coloração sequencial',
                instructions = [],
                result = [],
                steps = [
                    'algoritmo coloracaoSequencial(G,v):',
                    'C[i] = [], i = 1...n, k = 1',
                    'para i <= n',
                    '    LOOP: para i <= n',
                    '    se N(i) não pertencer a C[k] ' ,
                    '        Adicionar i a C[k]',
                    '    senão',
                    '        k++, goto LOOP',
                    '    fim-se',
                    '    k = 1',
                    'fim-para'
                ];

            /**
             *
             * @param graph
             * @param visited
             * @returns {Array}
             */
            function run(graph, visited) {
                console.log('iniciando coloração sequencial');

                var vertice = graph.getNode(visited);

                coloracaoSequencial(graph, vertice);
                console.log('fim: coloração sequencial');

                console.log(result);
                return result;
            }

            /**

             * 1  para i= 1 até n faça
             2      Ci = []
             3  fim-para
             4  k ← 1
             5  para i= 1 até n faça
                     enquanto não atribuir xi a Ck faça
                         se vizinhos(xi) interseccao Ck = 0
                            Ck = Ck U {xi}
                         senão
                            k += 1;
                         fim-se
                       fim-enquanto
                   k ← 1
             14  fim-para
             *
             * @param G
             * @param v
             */
            function coloracaoSequencial(G, v) {

                var nos = G.getNodes();
                var C = [];
                var i;
                var k;

                for(i = 0; i < nos.length; i++ ){
                    C[i] = [];
                }

                for(i = 0, k = 0; i < nos.length; i++ ){

                    var vizinhos = G.getVizinhos(nos[i]);

                    console.log('vizinhos de ');
                    console.log(nos[i]);
                    console.log(vizinhos);

                    for(var atribuido = false; atribuido !== true;){

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


                        if(contem){
                            k++;
                        }
                        else{
                            C[k].push(nos[i]);
                            atribuido = true;
                        }
                    }
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