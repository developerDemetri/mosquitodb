'use strict';

angular.module('mosquitoApp').controller('submitController', function ($scope, $http) {

  let states = [];
  let county_temp = 'Select a State';

  $scope.states = [];
  $scope.counties = [];
  $scope.species = [];

  $scope.state = null;
  $scope.county = null;
  $scope.spec = null;

  $http.get(getServer()+'/states').then(function(response) {
    if (response.data.status === 200) {
      $scope.states = response.data.states;
      $('#state').selectpicker('refresh');
      console.log($scope.states)
    }
    else {
      console.log(response);
    }
  });

  $http.get(getServer()+'/species').then(function(response) {
    if (response.data.status === 200) {
      $scope.species = response.data.species;
      $('#species').selectpicker('refresh');
    }
    else {
      console.log(response);
    }
  });

  function populateCounties() {
    $http.get(getServer()+'/counties/'+$scope.state).then(function(response) {
      if (response.data.status === 200) {
        $scope.counties = response.data.counties;
        $('#county').selectpicker('refresh');
      }
      else {
        console.log(response);
      }
    });
  }

});
