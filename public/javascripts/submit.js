'use strict';

angular.module('mosquitoApp').controller('submitController', function ($scope, $http, $timeout) {

  $scope.states = [];
  $scope.counties = [];
  $scope.species = [];
  $scope.traps = [];

  $scope.isError = false;
  $scope.year = null;
  $scope.month = null;
  $scope.week = null;
  $scope.state = null;
  $scope.county = null;
  $scope.spec = null;
  $scope.trap = null;
  $scope.nights = null;
  $scope.wnv_results = null;
  $scope.comment = null;

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

  $scope.$watch('state', function(newvalue, oldvalue) {
    if (newvalue) {
      populateCounties();
    }
  });

  $scope.submitData = function() {
    if ($scope.year && $scope.state && $scope.county && $scope.spec && $scope.trap && $scope.wnv_results) {
      $scope.isError = false;
      var sumbmission = $.param({
        "year": $scope.year,
        "month": $scope.month,
        "week": $scope.week,
        "state": $scope.state,
        "county": $scope.county,
        "species": $scope.spec ,
        "trap": $scope.trap,
        "nights": $scope.nights,
        "wnv_results": $scope.wnv_results,
        "comment": $scope.comment
      });
      var config = {
          headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
          }
      }
      $http.post(getServer()+'/submit', sumbmission, config)
      .success(function (data, status, headers, config) {
          console.log('submitted');
          console.log(data);
      })
      .error(function (data, status, header, config) {
          console.log('error!');
          console.log(data);
      });
    }
    else {
      $scope.isError = true;
    }
  }

});
