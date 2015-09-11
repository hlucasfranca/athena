angular.module('graphe.services')
    .service('contextMessage', contextMessage);

function contextMessage () {
    'use strict';

    var message = "";

    function setMessage(message){
        message = message;
    }

    var service = {
        message: message,
        setMessage: setMessage

    };

    return service;
}