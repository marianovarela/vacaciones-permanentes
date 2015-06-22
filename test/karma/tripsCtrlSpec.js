'use strict';

describe('Main Controller', function() {
  var ctrl, scope, serviceTrips, serviceTrip;

  beforeEach(module('vacacionesPermanentes'));
  beforeEach(inject(function($controller, $rootScope, trips, trip) {

  scope = $rootScope.$new();
  serviceTrips = trips;
  serviceTrip = {'destinations':[]};
  //Create the controller with the new scope
  ctrl = $controller('TripsCtrl', {$scope: scope, trips: serviceTrips, trip:serviceTrip});
}));

    it('should clean scope after add ', inject(function ($controller) {
      expect(true).toBe(false);
    }));
})