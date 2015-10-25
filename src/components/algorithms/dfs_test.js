/*globals module, inject*/

describe('Service: dfs', function () {

    'use strict';

    beforeEach(module('graphe'));

    var depthFirstSearch,
        model,
        graph;

    beforeEach(inject(function (_dfs_, _model_) {
        depthFirstSearch = _dfs_;
        model = _model_;

        graph = model.getGraph();
    }));


    it('should return a array with the dfs path', function () {
        graph.addNode({id: 0});
        graph.addNode({id: 1});
        graph.addNode({id: 2});
        graph.addEdge(0, 1);
        graph.addEdge(0, 2);

        expect(depthFirstSearch.run(graph, 0)).toEqual([{id: 0}, {id: 1}, {id: 2}]);
    });

    it('should return a array with at least one node (the starting node)', function () {
        graph.addNode({id: 0});
        expect(depthFirstSearch.run(graph, 0)).toEqual([{id: 0}]);
    });

});
