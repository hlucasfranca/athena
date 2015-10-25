(function () {
    'use strict';
    angular.module('graphe.algorithms')
        .service('fab', function () {

            var fabOptions = {
                add: {
                    name: 'Add',
                    icon: 'add',
                    message: 'Click anywhere on the stage to add a node.',
                    enabled: true,
                    color: '#4CAF50',
                    contextOptions: [
                        {
                            name: 'Add Node',
                            icon: 'add_circle',
                            message: 'Click anywhere to add a node.'
                        },
                        {
                            name: 'Add Link',
                            icon: 'border_color',
                            message: 'Select a node to connect to another.',
                            enabled: true,
                            color: '#4CAF50'
                        }
                    ]
                },
                remove: {
                    name: 'Remove',
                    icon: 'clear',
                    message: 'Click on a node or link to remove.',
                    enabled: true,
                    color: '#F44336'
                },
                select: {
                    name: 'Select',
                    icon: 'check',
                    message: 'Click on a node or link to select.',
                    enabled: true,
                    color: '#FF9800',
                    contextOptions: [
                        {
                            name: 'Select',
                            icon: 'select_all',
                            message: 'Select all.'
                        }
                    ]
                },
                info: {
                    name: 'Information',
                    icon: 'info',
                    message: 'Click on a node or link for information, click on stage to global information.',
                    enabled: true,
                    color: '#2196F3'
                }
            };

            var service = {
                fabOptions : fabOptions,
                currentOption : fabOptions[0]
            };

            return service;
        });
})();