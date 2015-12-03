(function () {
    'use strict';
    /**
     * gpAlgorithmPlayer
     *
     * Directive to control the algorithm execution, gives a interface to communication
     * through the gpAlgorithmPlayerCtrl
     */

    angular.module('graphe.directives')
        .directive('gpAlgorithmPlayer', ['dfs','bfs','coloracaoSequencial', 'coloracaoClasse',gpAlgorithmPlayer])
        .controller('gpAlgorithmPlayerCtrl', gpAlgorithmPlayerCtrl);

    function gpAlgorithmPlayer() {
        return {
            restrict: 'E',
            require: ['^gpContainer', '^?gpStage'],
            controller: 'gpAlgorithmPlayerCtrl'
        };
    }

    function gpAlgorithmPlayerCtrl($scope, $interval, dfs,bfs, coloracaoSequencial, coloracaoClasse, broadcastService) {

        var timerAlgoritmo;

        $scope.$watch('algoritmoSelecionado', function(){

            console.log('mudou selecionado');

            $scope.pilha = [];
            $scope.fila = [];
            $scope.passoAtual = -1;
            $scope.resultado = [];
            $scope.emExecucao = false;
        });

        $scope.steps = [];
        $scope.selectedStep = -1;

        $scope.algorithms = [
            dfs,
            bfs,
            coloracaoSequencial,
            coloracaoClasse
        ];

        $scope.pilha = [];
        $scope.fila = [];
        $scope.passoAtual = -1;
        $scope.resultado = [];

        $scope.emExecucao = false;

        $scope.algoritmoSelecionado = $scope.algorithms[0];
        var operacaoAtual = 0;
        var resultado = [];

        $scope.runAlg = run;

        function proximoPasso(){

            if(operacaoAtual < resultado.length){
                var operacao = resultado[operacaoAtual];
                if(operacao.operacao !== ''){
                    broadcastService.broadcast(operacao.operacao, operacao.item);
                }

                if(operacao.pilha !== undefined){

                $scope.pilha = operacao.pilha.map(function(element){
                    return element.label;
                });
                }

                if(operacao.fila !== undefined) {
                    $scope.fila = operacao.fila.map(function (element) {
                        return element.label;
                    });
                }

                $scope.passoAtual = operacao.passo;

                //mapeia a array bidimensional de rotulos de cores
                if($scope.algoritmoSelecionado.usaCores !== undefined){

                    if(operacao.resultado !== undefined) {
                        $scope.resultado = operacao.resultado.map(function (element) {

                            return element.map(function(el){
                                return el.label;
                            });

                        });

                        console.log('cores');

                        console.log($scope.resultado);
                    }

                }
                else if(operacao.resultado !== undefined) {
                    $scope.resultado = operacao.resultado.map(function (element) {
                        return element.label;
                    });
                }


                operacaoAtual++;
            }
            else{
                $scope.emExecucao = false;

                broadcastService.broadcast('clean_all_nodes');
            }

        }

        function run() {


            if($scope.emExecucao){
                $scope.emExecucao = false;
            }

            else {
            $scope.showDialog(function (startNode) {
                $scope.emExecucao = true;

                resultado = $scope.algoritmoSelecionado.run($scope.graph, startNode);

                console.log(resultado);

                operacaoAtual = 0;




                if( angular.isDefined(timerAlgoritmo)){
                    $interval.cancel(timerAlgoritmo);
                    timerAlgoritmo = undefined;
                }

                // fixme executando multiplas vezes
                    timerAlgoritmo = $interval(proximoPasso, 1000, resultado.length + 1);
                


                console.log(resultado);
            });
            }
        }
    }
})();