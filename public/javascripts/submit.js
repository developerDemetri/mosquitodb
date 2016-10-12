'use strict';

angular.module('mosquitoApp').controller('submitController', function ($scope, $http, $timeout) {

  let states = [];
  let county_temp = 'Select a State';

  $scope.states = [];
  $scope.counties = [];
  $scope.species = [];
  $scope.traps = [];

  $scope.state = null;
  $scope.county = null;
  $scope.spec = null;
  $scope.trap = null;

  $http.get(getServer()+'/states').then(function(response) {
    if (response.data.status === 200) {
      $('#state').selectpicker();
      $scope.states = response.data.states;
      $timeout(function() {
        $('#state').selectpicker('refresh');
      }, 1);
    }
    else {
      console.log(response);
    }
  });

  $http.get(getServer()+'/species').then(function(response) {
    if (response.data.status === 200) {
      $('#species').selectpicker();
      $scope.species = response.data.species;
      $timeout(function() {
        $('#species').selectpicker('refresh');
      }, 1);
    }
    else {
      console.log(response);
    }
  });

  $http.get(getServer()+'/traps').then(function(response) {
    if (response.data.status === 200) {
      $('#trap').selectpicker();
      $scope.traps = response.data.traps;
      $timeout(function() {
        $('#trap').selectpicker('refresh');
      }, 1);
    }
    else {
      console.log(response);
    }
  });

  function populateCounties() {
    $http.get(getServer()+'/counties/'+$scope.state).then(function(response) {
      if (response.data.status === 200) {
        $('#county').selectpicker();
        $scope.counties = response.data.counties;
        $timeout(function() {
          $('#county').selectpicker('refresh');
        }, 1);
      }
      else {
        console.log(response);
      }
    });
  }

});
