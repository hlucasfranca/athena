/*globals module, inject*/

describe('Service: coloracaoSequencial', function () {
    'use strict';

    beforeEach(module('graphe'));

    var coloracaoSequencial,
        model,
        grafo;

    beforeEach(inject(function (_coloracaoSequencial_, _model_) {
        coloracaoSequencial = _coloracaoSequencial_;
        model = _model_;
        grafo = model.getGraph();
    }));

    it('deve retornar um array com o percurso em largura', function () {
        grafo.addNode({id: 0});
        grafo.addNode({id: 1});
        grafo.addNode({id: 2});
        grafo.addEdge(0, 1);
        grafo.addEdge(1, 2);

        expect(coloracaoSequencial.run(grafo, 0)).toEqual([{id: 0}, {id: 1}, {id: 2}]);
    });

    it('deve retornar um array com pelo menos um nó(o nó inicial)', function () {
        grafo.addNode({id: 0});

        expect(coloracaoSequencial.run(grafo, 0)).toEqual([{id: 0}]);
    });
});
