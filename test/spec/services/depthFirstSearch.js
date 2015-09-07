'use strict';

describe('Service: depthFirstSearch', function () {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var depthFirstSearch;
  beforeEach(inject(function (_depthFirstSearch_) {
    depthFirstSearch = _depthFirstSearch_;
  }));

  it('should do something', function () {
    expect(!!depthFirstSearch).toBe(true);
  });

});
