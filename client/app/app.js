(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name app
     * @description
     * # app
     *
     * Main module of the application.
     */
    angular
        .module('graphe', [
            'graphe.core',
            'graphe.algorithms',
            'graphe.directives',
            'graphe.fab',
            'graphe.model',
            'graphe.services'
        ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/main/main.html',
                    controller: 'MainCtrl',
                    index: 1
                })
                .when('/graph', {
                    templateUrl: 'app/main/graph.html',
                    //controller: 'GraphCtrl',
                    index: 2
                })

                .when('/about', {
                    templateUrl: 'app/about/about.html',
                    controller: 'AboutCtrl',
                    index: 3
                })
                .when('/contact', {
                    templateUrl: 'app/contact/contact.html',
                    controller: 'ContactCtrl',
                    index: 4
                })

                .otherwise({
                    redirectTo: '/'
                });
        });

})();