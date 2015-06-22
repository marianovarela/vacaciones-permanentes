'use strict';
/
describe('Testing Trips Controller', function() {
  var _scope, TripsController;

  beforeEach(function() {
    module('vacacionesPermanentes');

    inject(function($rootScope, $controller) {
      _scope = $rootScope.$new();
      TripsController = $controller('TripsCtrl', {
        $scope: _scope
      });
    });
  });

  it('Should be registered', function() {
    expect(TripsController).toBeDefined();
  });
});
