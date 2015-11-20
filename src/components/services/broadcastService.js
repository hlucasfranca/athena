(function () {
    'use strict';

    angular.module('graphe.services')
        .service('broadcastService', broadcastService);

    function broadcastService($rootScope) {

        var message = '';
        var object = undefined;


        var service = {
            message: message,
            object: object,
            broadcast: broadcast
        };

        function broadcast(m,o){
            service.message = m | '';
            service.object = o | undefined;

            $rootScope.$broadcast(m);
        }

        return service;
    }
})();