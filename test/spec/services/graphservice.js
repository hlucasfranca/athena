'use strict';

describe('Service: GraphService', function () {

  // load the service's module
  beforeEach(module('grapheApp'));

  // instantiate service
  var GraphService;
  beforeEach(inject(function (_GraphService_) {
    GraphService = _GraphService_;
  }));

  it('should do something', function () {
    expect(!!GraphService).toBe(true);
  });

});
