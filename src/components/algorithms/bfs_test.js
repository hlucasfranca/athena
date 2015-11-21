/*globals module, inject*/

describe('Service: bfs', function () {
    'use strict';

    beforeEach(module('graphe'));

    var breadthFirstSearch,
        model,
        graph;

    beforeEach(inject(function (_bfs_, _model_) {
        breadthFirstSearch = _bfs_;
        model = _model_;

        graph = model.getGraph();
    }));

    it('deve retornar um array com o percurso em largura', function () {
        graph.addNode({id: 0});
        graph.addNode({id: 1});
        graph.addNode({id: 2});
        graph.addEdge(0, 1);
        graph.addEdge(1, 2);

        expect(breadthFirstSearch.run(graph, 0)).toEqual([{id: 0}, {id: 1}, {id: 2}]);
    });

    it('deve retornar um array com pelo menos um nó(o nó inicial)', function () {
        graph.addNode({id: 0});

        expect(breadthFirstSearch.run(graph, 0)).toEqual([{id: 0}]);
    });

});
