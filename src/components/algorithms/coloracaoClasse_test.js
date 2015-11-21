/*globals module, inject*/

describe('Service: coloracaoClasse', function () {
    'use strict';

    beforeEach(module('graphe'));

    var coloracaoClasse,
        model,
        grafo;

    beforeEach(inject(function (_coloracaoClasse_, _model_) {
        coloracaoClasse = _coloracaoClasse_;
        model = _model_;

        grafo = model.getGraph();
    }));

    it('deve retornar o conjunto C de cores', function () {
        grafo.addNode({id: 0});
        grafo.addNode({id: 1});
        grafo.addNode({id: 2});
        grafo.addEdge(0, 1);
        grafo.addEdge(1, 2);

        var resultadoEsperado = [
            [],
            []
        ];

        expect(coloracaoClasse.run(grafo)).toEqual(resultadoEsperado);
    });
});
