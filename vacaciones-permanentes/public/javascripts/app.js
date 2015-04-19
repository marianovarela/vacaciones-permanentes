/**
 * Created by Martin Alejandro Melo on 22/03/2015.
 */
var app = angular.module('vacacionesPermanentes', ['ui.router','angularMoment']);
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
function($scope, trips){
	$scope.trips = trips.trips;
	
	$scope.addTrip = function(){
	  if(!$scope.trip.name || $scope.trip.name === '') { return; }
	  trips.create({
	    name: $scope.trip.name,
	    start: $scope.trip.start,
	    end: $scope.trip.end,

	  }).success(function(trip) {
      $scope.trips.push(trip);
    });
	  $scope.trip.name = '';
	};
	
	$scope.deleteTrip = function(id){
		trips.delete(id).success(function() {
            });
	};
		
	
}]);

app.controller('TripsCtrl', [
'$scope',
'trips',
function($scope, trips){
    $scope.trips = trips.trips;
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
	  return res.data;
	});
  };	
  
  o.get = function(id) {
  return $http.get('/trips/' + id).then(function(res){
    return res.data;
  });
};
  
  return o;
}]);