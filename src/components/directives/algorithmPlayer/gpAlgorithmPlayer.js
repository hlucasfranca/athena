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



        //var currentInstruction = 0;
        $scope.steps = [];
        $scope.selectedStep = -1;
        //$scope.depthInstructions = dfs.steps;

        $scope.algorithms = [
            dfs,
            bfs,
            coloracaoSequencial,
            coloracaoClasse
        ];
        $scope.selectedAlgorithm = $scope.algorithms[0];

        var currentStep = 0;

        $scope.nextStep = nextStep;
        $scope.runAlg = run;
        $scope.selectStep = selectStep;

        /*
         * TODO add previous step, add current node display, highlight current visited link
         *
         * */

        function nextStep() {
            if (currentStep < $scope.steps.length) {
                if (currentStep > 0) {
                    // $scope.deselectNode($scope.steps[currentStep - 1].visited.index);
                    var sourceNode = $scope.steps[currentStep - 1].visited;
                    var targetNode = $scope.steps[currentStep].visited;
                    if (sourceNode !== targetNode) {
                        broadcastService.broadcast('select_link', {source:sourceNode, target: targetNode});
                    }
                }
                var step = $scope.steps[currentStep];

                broadcastService.broadcast('select_node', step.visited);

                $scope.selectedStep = step.instruction;
                currentStep++;
            }
        }

        function run() {

            $scope.showDialog(function (startNode) {
                //gpStageController.toggleOpacityLinks();

                $scope.selectedAlgorithm.run($scope.graph, startNode);

                $scope.steps = $scope.selectedAlgorithm.instructions;

                console.log($scope.steps);

                // TODO add stop/pause
                $interval($scope.nextStep, 500, $scope.steps.length);
                $scope.steps.push({ instruction: 5 });
            });
        }

        function selectStep(step) {
            $scope.selectedStep = step;
        }
    }
})();