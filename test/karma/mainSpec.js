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