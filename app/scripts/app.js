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
        'graphe.model'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                index: 1
            })
            .when('/graph', {
                templateUrl: 'views/graph.html',
                //controller: 'GraphCtrl',
                index: 2
            })

            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                index: 3
            })
            .when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'ContactCtrl',
                index: 4
            })

            .otherwise({
                redirectTo: '/'
            });
    });

