angular.module('graphe.directives')
    .directive('gpAlgorithmPlayer', gpAlgorithmPlayer)
    .controller('gpAlgorithmPlayerCtrl', gpAlgorithmPlayerCtrl);

function gpAlgorithmPlayer(){
        'use strict';
        return {
            restrict: 'E',
            require: ['^gpContainer', '^?gpStage'],
            controller: 'gpAlgorithmPlayerCtrl'
        };
}

function gpAlgorithmPlayerCtrl ($scope, $interval, dfs){
        'use strict';
        var currentInstruction = 0;
        $scope.steps = [];
        $scope.selectedStep = -1;
        $scope.depthInstructions = dfs.steps;
        $scope.result = dfs.result;

        $scope.algorithms = [dfs];
        $scope.selectedAlgorithm = $scope.algorithms[0];

        var currentStep = 0;

        $scope.nextStep = nextStep;
        $scope.runAlg = run;
        $scope.selectStep = selectStep;

        /*
         * TODO add previous step, add current node display, highlight current visited link
         *
         * */

        function nextStep (){
            if(currentStep < $scope.steps.length) {
                if(currentStep > 0) {
                    // $scope.deselectNode($scope.steps[currentStep - 1].visited.index);
                    var sourceNode = $scope.steps[currentStep - 1].visited;
                    var targetNode = $scope.steps[currentStep].visited;
                    if(sourceNode !== targetNode){
                        $scope.selectLink(sourceNode.label, targetNode.label);
                    }
                }
                var step = $scope.steps[currentStep];
                $scope.selectNode(step.visited.index);
                $scope.selectedStep = step.instruction;
                currentStep++;
            }
        }

        function run (){

            var nodes = $scope.graph.getNodes();
            var options = [];

            nodes.forEach(function(element,index){
                options.push(element.label);
            })

            $scope.setOptions(options);

            $scope.showDialog(function(startNode){
                $scope.toggleOpacityLinks();

                
                $scope.selectedAlgorithm.run($scope.graph, startNode);
                $scope.steps = $scope.selectedAlgorithm.instructions;

                // TODO add stop/pause
                $interval( $scope.nextStep, 500, $scope.steps.length);
                //$scope.steps.push({ instruction: 5 });
            });

            
        }

        function selectStep (step){
            $scope.selectedStep = step;
        }
}
