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
        var self = this;

        $rootScope.$on("$routeChangeSuccess", function (e, current, previous) {

            self.selectOption(current.index);

        });

        this.selectOption = function(setOption){
            this.option = setOption;
        };

        this.isSelected = function(index){
            return this.option === index;
        };

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }]);
