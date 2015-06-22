'use strict';

describe('Trips Controller', function() {
  var ctrl, scope, serviceTrips, serviceTrip;

  beforeEach(module('vacacionesPermanentes'));
  beforeEach(inject(function($controller, $rootScope, trips, trip) {

  scope = $rootScope.$new();
  serviceTrips = trips;
  serviceTrip = {'destinations':[]};
  //Create the controller with the new scope
  ctrl = $controller('TripsCtrl', {$scope: scope, trips: serviceTrips, trip:serviceTrip});
  }));

    it('should return empty list mocking empty list of trips', inject(function ($controller) {
      var tripsMocked = [];
      spyOn(serviceTrips, "getAll").and.returnValue(tripsMocked);
      expect(serviceTrips.getAll()).toEqual([]);
    }));

    it('should return recently added trips', inject(function ($controller) {
      var storedTrips = [{'id':1, 'name':'Buenos Aires'}, {'id':2, 'name':'Bariloche'}];
      spyOn(serviceTrips, "getAll").and.returnValue(storedTrips);
      expect(serviceTrips.getAll()).toEqual([{'id':1, 'name':'Buenos Aires'}, {'id':2, 'name':'Bariloche'}]);
    }));

    it('Should include destination methods', function() {
      expect(scope.addDestination).toBeDefined();
      expect(scope.deleteDestination).toBeDefined();
  });
})

