'use strict';

angular.module('mosquitoApp').controller('homeController', function ($scope, $http, $timeout) {

  $scope.states = [];
  $scope.counties = [];
  $scope.species = [];
  $scope.startYear = 1900;
  $scope.endYear = 2017;
  $scope.state = null;
  $scope.county = null;
  $scope.spec = null;

  $scope.results = [];

  function setup() {

  }

  $scope.search = function() {
    var query_params = {
      start: $scope.startYear,
      end: $scope.endYear,
      state: $scope.state,
      county: $scope.county,
      species: $scope.spec
    };
    var config = {
     params: query_params,
     headers : {'Accept' : 'application/json'}
    };
    $http.get(getServer()+'/query', config).then(function(response) {
      if (response.data.status === 200) {
        $scope.results = response.data.results;
        console.log($scope.results)
        $('#search-results').removeClass('hidden');
      }
      else {
        console.log(response.data.error);
      }
    });

  }

  function backToOptions() {
    $scope.searching = true;
  }

  $http.get(getServer()+'/states').then(function(response) {
    if (response.data.status === 200) {
      $('#state').selectpicker();
      $scope.states = response.data.states;
      $timeout(function() {
        $('#state').selectpicker('refresh');
      }, 1);
    }
    else {
      console.log(response.data.error);
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
      console.log(response.data.error);
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
        console.log(response.data.error);
      }
    });
  }

  $scope.$watch('state', function(newvalue, oldvalue) {
    if (newvalue) {
      populateCounties();
    }
  });

});
