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
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/graph', {
                templateUrl: 'views/graph.html',
                controller: 'GraphCtrl'
            })
            .when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'ContactCtrl'
            })

            .otherwise({
                redirectTo: '/'
            });
    });
