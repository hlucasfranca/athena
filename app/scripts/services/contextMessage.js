angular.module('graphe.services')
    .service('contextMessage', contextMessage);

function contextMessage () {
    'use strict';

    var message = "";

    function setMessage(m){
        message = m;
    }

    var service = {
        message: message,
        setMessage: setMessage

    };

    return service;
}