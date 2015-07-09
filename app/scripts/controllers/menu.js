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

        $scope.opcao = 1;

        var self = this;

        $rootScope.$on("$routeChangeSuccess", function (e, next, previous) {

            if (next) {
                self.selectOption(next.$$route.index);
                console.log(next.$$route);
            } else{
                self.selectOption(previous.$$route.index);
                console.log(previous.$$route);
            }
        });

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
