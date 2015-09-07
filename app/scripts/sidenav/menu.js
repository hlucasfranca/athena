'use strict';

/**
 * @ngdoc function
 * @name app.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the app
 */
angular.module('graphe')
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
