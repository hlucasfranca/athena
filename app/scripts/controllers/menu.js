'use strict';

/**
 * @ngdoc function
 * @name grapheApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the grapheApp
 */
angular.module('grapheApp')
    .controller('MenuCtrl', ['$scope','$rootScope', function ($scope, $rootScope) {

        this.option = 1;

        this.selectOption = function(setOption){
            this.option = setOption;
        };

        this.isSelected = function(checkOption){
            return this.option === checkOption;
        };

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }]);
