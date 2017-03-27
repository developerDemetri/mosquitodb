'use strict';

angular.module('mosquitoApp', []).run(function($rootScope, $http, $window) {

  var isLive = false; // change if on server

  if (isLive === true) {
    $rootScope.server = 'https://zodo.asu.edu/mosquito';
  }
  else {
    $rootScope.server = location.protocol + '//' + location.hostname + ':' + location.port;
  }

  $rootScope.logout = function() {
    $http.delete($rootScope.server+'/account/logout')
    .success(function(response) {
      $window.location.href = $rootScope.server+'/';
    })
    .error(function(response) {
      console.log("Failed to log out: ", response);
    });
  };

  $rootScope.checkInput = function(input, type, regex) {
    if (input) {
      if (type === 'string') {
        if (typeof(input) === 'string' && regex.test(input)) {
          return true;
        }
      }
      else if (type === 'number') {
        if (typeof(input) === 'number' || !(isNaN(input))) {
          return true;
        }
      }
    }
    return false;
  };

});
