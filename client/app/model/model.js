(function () {
    'use strict';

    angular.module('graphe.model')
        .factory('model', ['colors', 'labels', model]);

    function model(colors, labels) {

        var service = {
            getGraph: getGraph
        };

        return service;

        function getGraph(v) {
            labels.restart();
            return new Graph(v);
        }

        function Graph() {

            var vertices = [],
                adj = [],
                directed = false,
                links = [],
                id = 0,
                adjMatrix = [];

            return {
                addNode: addNode,
                removeNode: removeNode,

                addEdge: addEdge,
                removeEdge: removeEdge,

                getNodes: getNodes,
                getNode: getNode,

                getEdge: getEdge,
                getEdges: getEdges,

                getAdjacencyList: getAdjacencyList,
                getAdjacencyMatrix: getAdjacencyMatrix,

                setDirected: setDirected,
                isDirected: isDirected

            };

            function isDirected() {
                // prevent unwanted manipulation
                return directed === true;
            }

            function setDirected(d) {
                directed = (d === true);
            }

            function getEdge(source, target) {

                if (source === undefined || target === undefined) {
                    return null;
                }

                var s = getNode(source);
                var t = getNode(target);

                var foundLink = links.filter(function (element) {
                    return element.source.id === s.id && element.target.id === t.id;
                });

                return foundLink;

            }

            function getNode(id) {

                if (typeof id === 'number') {
                    return getNodes().filter(function (element, index) {
                        return element.id === id;
                    })[0];
                }
                else {
                    return id;
                }
            }

            function updateAdjacencyMatrix() {

                adjMatrix = [];
                var numberOfNodes = vertices.length;

                if (numberOfNodes > 0) {
                    vertices.forEach(function (node, i) {
                        adjMatrix[i] = [];

                        vertices.forEach(function (node, j) {
                            adjMatrix[i][j] = 0;
                        });

                    });

                    links.forEach(function (link) {
                        adjMatrix[link.source.id][link.target.id] = 1;

                        if (!directed) {
                            adjMatrix[link.target.id][link.source.id] = 1;
                        }
                    });
                }
            }

            function addNode(node) {
                //if node isn't provided


                node.id = id++;
                adj[vertices.length] = [];
                vertices.push(node);

                updateAdjacencyMatrix();
            }

            function removeNode(node) {
                vertices.splice(getNodeIndex(node), 1);
                adj.splice(getNodeIndex(node), 1);

                spliceLinksForNode(node);
            }

            function getNodeIndex(node) {

                var found = [];

                // by id
                if (typeof node === 'number') {
                    found = vertices.filter(function (element) {
                        return element.id === node;
                    });

                } else {
                    found = vertices.filter(function (element) {
                        return element.id === node.id;
                    });
                }

                return vertices.indexOf(found[0]);

            }

            function removeEdge(source, target) {

                var sourceIndex = getNodeIndex(source.id),
                    targetIndex = getNodeIndex(target.id);

                // remove from adj list
                adj[sourceIndex].splice(targetIndex, 1);
                removeLink(source, target);

                if (!directed) {
                    adj[targetIndex].splice(sourceIndex, 1);
                    removeLink(target, source);
                }

                updateAdjacencyMatrix();
            }

            function addEdge(v, w) {

                if(typeof v === 'number'){
                    v = getNode(v);
                }

                if(typeof w === 'number'){
                    w = getNode(w);
                }

                if (getEdge(v, w).length > 0) {
                    return;
                }

                var sourceIndex = getNodeIndex(v),
                    targetIndex = getNodeIndex(w);

                adj[sourceIndex].push(w);

                links.push({
                    source: getNode(v),
                    target: getNode(w)
                });

                if (!directed) {
                    adj[targetIndex].push(v);
                    links.push({
                        source: getNode(w),
                        target: getNode(v)
                    });
                }

                updateAdjacencyMatrix();

            }

            function getEdges() {
                return links;
            }

            function getNodes() {
                return vertices;
            }

            function getAdjacencyList(node) {

                return adj[getNodeIndex(node)];
            }

            function getAdjacencyMatrix() {
                return adjMatrix;
            }

            /**
             * Helper functions
             */

            function removeLink(source, target) {
                // remove from link list
                var foundLink = links.filter(function (element) {
                    return element.source.id === source.id && element.target.id === target.id;
                });

                links.splice(links.indexOf(foundLink), 1);
            }

            function spliceLinksForNode(node) {
                var toSplice = links.filter(function (l) {
                    return (l.source === node || l.target === node);
                });

                toSplice.map(function (l) {
                    links.splice(links.indexOf(l), 1);
                });
            }
        }
    }
})();
