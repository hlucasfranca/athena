'use strict';

/**
 * @ngdoc overview
 * @name grapheApp
 * @description
 * # grapheApp
 *
 * Main module of the application.
 */
angular
    .module('grapheApp', [
        'ngAnimate',
        'ngMaterial',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
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
                controller: 'GraphCtrl',
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

