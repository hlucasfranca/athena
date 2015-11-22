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
        //$scope.selectStep = selectStep;

        /*
         * TODO add previous step, add current node display, highlight current visited link
         *
         * */

        //function nextStep() {
        //    if (currentStep < $scope.steps.length) {
        //        if (currentStep > 0) {
        //            // $scope.deselectNode($scope.steps[currentStep - 1].visited.index);
        //            var sourceNode = $scope.steps[currentStep - 1].visited;
        //            var targetNode = $scope.steps[currentStep].visited;
        //            if (sourceNode !== targetNode) {
        //                broadcastService.broadcast('select_link', {source:sourceNode, target: targetNode});
        //            }
        //        }
        //        var step = $scope.steps[currentStep];
        //
        //        broadcastService.broadcast('select_node', step.visited);
        //
        //        $scope.selectedStep = step.instruction;
        //        currentStep++;
        //    }
        //}

        function proximoPasso(){

            if(operacaoAtual < resultado.length){
                //resultado.push({ operacao: 'visitar_no', passo: '0', fila: [] });
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

                if(operacao.resultado !== undefined) {
                    $scope.resultado = operacao.resultado.map(function (element) {
                        return element.label;
                    });
                }


                operacaoAtual++;
            }
            else{
                $scope.emExecucao = false;
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
                $scope.timerAlgoritmo = $interval(proximoPasso, 1000, resultado.length + 1);
                console.log(resultado);
            });
            }
        }
    }
})();