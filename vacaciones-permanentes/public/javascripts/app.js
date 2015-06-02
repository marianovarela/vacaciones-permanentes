/**
 * Created by Martin Alejandro Melo on 22/03/2015.
 */
var app = angular.module('vacacionesPermanentes', ['ui.router','angularMoment', 'ui.bootstrap', 'google.places', 'uiGmapgoogle-maps', 'ngAutocomplete']);
app.run(function(amMoment) {
    amMoment.changeLocale('es');
});
app.constant('angularMomentConfig', {
    preprocess: 'unix',
    timezone: 'Europe/London'
});
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider.state('home', {
              url: '/home',
              templateUrl: '/home.html',
              controller: 'MainCtrl',
              resolve: {
          postPromise: ['trips', function(trips){
            return trips.getAll();
          }]
          }
              
            })
            
            .state('trips', {
        url: '/trips/{id}',
        templateUrl: '/trips.html',
        controller: 'TripsCtrl',
        resolve: {
          trip: ['$stateParams', 'trips', function($stateParams, trips) {
            return trips.get($stateParams.id);
          }]
        }
      })

            .state('destinations', {
              url: '/destinations/{id}',
              templateUrl: '/destinations.html',
              controller: 'DestinationsCtrl',
              resolve: {
                destination: ['$stateParams', 'destinations', function($stateParams, destinations) {
                  return destinations.get($stateParams.id);
                }]
              }
            })

            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
    }]);
app.factory('auth', ['$http', '$window', function($http, $window){
    var auth = {};
    auth.saveToken = function (token){
        $window.localStorage['vacaciones-permanentes-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['vacaciones-permanentes-token'];
    };
    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };
    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };
    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };
    auth.logOut = function(){
        $window.localStorage.removeItem('vacaciones-permanentes-token');
    };
    return auth;
}]);

app.controller('NavCtrl', ['$scope','auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);

app.controller('AuthCtrl', ['$scope','$state', 'auth',function($scope, $state, auth){
        $scope.user = {};

        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };
    }]);

app.controller('MainCtrl', [
'$scope',
'trips',
'$modal',
function($scope, trips, $modal){
  $scope.trips = trips.trips;
  
  $scope.addTrip = function(){
    console.log($scope.trip);
    if(!$scope.trip.name || $scope.trip.name === '') { return; }
    trips.create({
      name: $scope.trip.name,
      start: $scope.trip.start,
      end: $scope.trip.end,

    }).success(function(trip) {
      // $scope.trips.push(trip);
    });
    $scope.trip.name = '';
  };
  
  $scope.deleteTrip = function(id){
        $scope.open(id);
  };

    $scope.open = function (id) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          trip: function () {
            return id;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
      });
    };  
    
  
}]);

app.controller('TripsCtrl', [
'$scope',
'$modal',
'trips',
'trip',
function($scope, $modal, trips, trip){
    $scope.trip = trip;
    $scope.trips = trips.trips;
    $scope.map = {};
    $scope.polylines = [];
    $scope.options = {
      'types': '(regions)',
    }

    if(trip.destinations.length > 0){
        $scope.map = { center: { latitude: trip.destinations[0].locationA, longitude: trip.destinations[0].locationF }, zoom: 5 };
        $scope.polylines = [
            {
                path: get_paths(trip.destinations),
                stroke: {
                    color: '#6060FB',
                    weight: 3
                },
                editable: true,
                draggable: true,
                geodesic: true,
                visible: true,
            },
        ];
    }


function get_paths(destinations){
  var paths = [];
  for (var i = 0; i < destinations.length; i++) {
    paths[i] = { 'latitude': destinations[i].locationA,  'longitude': destinations[i].locationF }
}
  return paths
}

$scope.addDestination = function(){
  console.log($scope.city);
  console.log($scope.details);
  if($scope.name === '') { return; }
  trips.addDestination(trip._id, {
    name: $scope.details.formatted_address,
    icon: $scope.details.icon,
    locationA: $scope.details.geometry.location.A,
    locationF: $scope.details.geometry.location.F,
    zaA: $scope.details.geometry.viewport.za.A,
    zaJ: $scope.details.geometry.viewport.za.j,
    qaA: $scope.details.geometry.viewport.qa.A,
    qaJ: $scope.details.geometry.viewport.qa.j,
    arrival: $scope.city.arrival,
    departure: $scope.city.departure,

  }).success(function(destination) {
    $scope.trip.destinations.push(destination);
  });
  $scope.name = '';
};

$scope.deleteDestination = function(destination){
  $scope.open_confirmation(destination, $scope.trip);
}

$scope.open_confirmation = function (destination, trip) {

      var modalInstance = $modal.open({
        templateUrl: 'DeleteCityModal.html',
        controller: 'DeleteCityConfirmCtrl',
        resolve: {
          destination: function () {
            return destination;
          },
          trip: function () {
            return trip;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
      });
    };  

}]);

app.controller('DestinationsCtrl', [
'$scope',
'$modal',
'destinations',
'destination',
function($scope, $modal, destinations, destination){
    $scope.destination = destination;
    $scope.map = {};
    $scope.polylines = [];
    $scope.options = {};
    $scope.lodgingPolylines = [];
    var SW = new google.maps.LatLng($scope.destination.zaA, $scope.destination.qaJ);
    var NE = new google.maps.LatLng($scope.destination.zaJ, $scope.destination.qaA);
    var bounds = new google.maps.LatLngBounds(SW, NE);
    $scope.options.bounds = bounds;
    $scope.lodgingOptions = {}

    if(destination.lodging){
        $scope.lodgingMap = { center: { latitude: destination.lodging.locationA, longitude: destination.lodging.locationF }, zoom: 10 };
        $scope.lodgingPolylines = [
            {
                path: [{'latitude':destination.lodging.locationA,'longitude':destination.lodging.locationF}],
                stroke: {
                    color: '#6060FB',
                    weight: 3
                },
                editable: true,
                draggable: true,
                geodesic: true,
                visible: true,
            },
        ];
    }
    initMap();
    
    function initMap(){
      if(destination.pois.length > 0){
          $scope.map = { center: { latitude: destination.pois[0].locationA, longitude: destination.pois[0].locationF }, zoom: 5 };
          $scope.polylines = [
              {
                  path: get_paths(destination.pois),
                  stroke: {
                      color: '#6060FB',
                      weight: 3
                  },
                  editable: true,
                  draggable: true,
                  geodesic: true,
                  visible: true,
              },
          ];
      }
  }

    function get_paths(destinations){
      //TODO hacer un service para no duplicar este metodo
      var paths = [];
      for (var i = 0; i < destinations.length; i++) {
        paths[i] = { 'latitude': destinations[i].locationA,  'longitude': destinations[i].locationF }
    }
      return paths
    };

    $scope.addPOI = function () {
      if($scope.poi === '' || $scope.poi == undefined) { return; }
      destinations.addPOI($scope.destination._id, {
        name: $scope.details.name,
        address: $scope.details.formatted_address,
        icon: $scope.details.icon,
        locationA: $scope.details.geometry.location.A,
        locationF: $scope.details.geometry.location.F,
      }).success(function(poi) {
        $scope.destination.pois.push(poi);
      });
      $scope.name = '';
    };

    $scope.deletePOI = function(poi){
      $scope.open_confirmation(poi, $scope.destination);
    }


    $scope.addLodging = function () {
      if($scope.lodging === '' || $scope.lodging == undefined) { return; }
      destinations.addLodging($scope.destination._id, {
        name: $scope.details.name,
        address: $scope.details.formatted_address,
        phone: $scope.details.formatted_phone_number,
        icon: $scope.details.icon,
        locationA: $scope.details.geometry.location.A,
        locationF: $scope.details.geometry.location.F,
      }).success(function(lodging) {
        $scope.destination.lodging = lodging;
      });
      $scope.name = '';
    };

    $scope.deleteLodging = function(lodging){
      $scope.delete_lodging_confirmation(lodging, $scope.destination);
    }

        $scope.delete_lodging_confirmation = function (lodging, destination) {
          console.log(lodging);
          var modalInstance = $modal.open({
            templateUrl: 'DeleteLodgingModal.html',
            controller: 'DeleteLodgingConfirmCtrl',
            resolve: {
              lodging: function () {
                return lodging;
              },
              destination: function () {
                return destination;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
          });
        };  

    $scope.open_confirmation = function (poi, destination) {

          var modalInstance = $modal.open({
            templateUrl: 'DeletePOIModal.html',
            controller: 'DeletePOIConfirmCtrl',
            resolve: {
              poi: function () {
                return poi;
              },
              destination: function () {
                return destination;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
          });
        };  

}]);

app.factory('trips', ['$http', 'auth', function($http, auth){
  var o = {
    trips: []
  };
  
  o.create = function(trip) {
  return $http.post('/trips', trip, {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
    o.trips.push(data);
  });
  };
  
  o.getAll = function() {
    return $http.get('/trips', {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      angular.copy(data, o.trips);
    });
  };
  
  o.delete = function(id) {
  return $http.post('/trips/delete/' + id, {headers: {Authorization: 'Bearer '+auth.getToken()}}).then(function(res){
    var index, trip, _i, _len;
    // Borro el trip de la lista de trips
    for (_i = 0, _len = o.trips.length; _i < _len; _i++) {
    trip = o.trips[_i];
    if (trip._id === id) {
       index = o.trips.indexOf(trip);
       o.trips.splice(index, 1);
      }
    };
    return res.data;
  })};

  o.deleteDestination = function(id) {
    return $http.post('/destinations/delete/' + id, {headers: {Authorization: 'Bearer '+auth.getToken()}})};

  o.get = function(id) {
  return $http.get('/trips/' + id).then(function(res){
    return res.data;
  });
};

  o.addDestination = function(id, destination) {
  return $http.post('/trips/' + id + '/destination', destination);
};

  
  return o;
}]);

app.factory('destinations', ['$http', 'auth', function($http, auth){
  var o = {
    destinations: []
  };

  o.getAll = function() {
    return $http.get('/destinations', {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      angular.copy(data, o.destinations);
    });
  };

  o.get = function(id) {
  return $http.get('/destinations/' + id).then(function(res){
    return res.data;
  });
};

  o.addPOI = function(id, poi) {
    return $http.post('/destinations/' + id + '/poi', poi);
  };

  o.deletePOI = function(id) {
    return $http.post('/pois/delete/' + id, {headers: {Authorization: 'Bearer '+auth.getToken()}})};

  o.addLodging = function(id, lodging) {
    return $http.post('/destinations/' + id + '/lodging', lodging);
  };

  o.deleteLodging = function(id) {
    return $http.post('/lodging/delete/' + id, {headers: {Authorization: 'Bearer '+auth.getToken()}})};

  return o;
}]);

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, trips, trip) {

  $scope.trip = trip;

  $scope.ok = function () {
    $modalInstance.close(); 
    trips.delete($scope.trip);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('DeleteCityConfirmCtrl', function ($scope, $modalInstance, trips, destination, trip) {

  $scope.destination = destination;

  $scope.ok = function () {
    $modalInstance.close(); 
    trips.deleteDestination(destination._id);
    var index = trip.destinations.indexOf(destination);
    trip.destinations.splice(index, 1);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('DeletePOIConfirmCtrl', function ($scope, $modalInstance, destinations, poi, destination) {

  $scope.poi = poi;

  $scope.ok = function () {
    $modalInstance.close(); 
    destinations.deletePOI(poi._id);
    var index = destination.pois.indexOf(poi);
    destination.pois.splice(index, 1);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('DeleteLodgingConfirmCtrl', function ($scope, $modalInstance, destinations, lodging, destination) {

  $scope.lodging = lodging;

  $scope.ok = function () {
    $modalInstance.close(); 
    destinations.deleteLodging(lodging._id);
    destination.lodging = null;
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});