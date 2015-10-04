(function () {
    'use strict';
    angular.module('graphe')
        .controller('ContactCtrl', function ($scope) {

            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.email = '';
        });

})();