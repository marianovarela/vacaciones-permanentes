'use strict';

describe('Testing Vacaciones-Permanentes Module', function() {
  var mainModule;

  beforeEach(function() {
    mainModule = angular.module('vacacionesPermanentes');
  });

  it('Should be registered', function() {
    expect(mainModule).toBeDefined();
  });
});

describe('Main Ctrl', function () {

  var tripMockeado = {'name': 'Bariloche'};

  beforeEach(module('vacacionesPermanentes'));

  describe('MainCtrl', function () {


    it('should clean scope after add ', inject(function ($controller) {
      var $scope = {'trip':tripMockeado};
      $controller('MainCtrl', { $scope: $scope }); 
      expect($scope.trip.name).toBe('Bariloche');
      $scope.addTrip();
      expect($scope.trip.name).toBe('');
    }));

  });
});
