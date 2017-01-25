'use strict';

angular.module('mosquitoApp').controller('submitController', function ($scope, $http, $timeout) {

  $scope.states = [];
  $scope.counties = [];
  $scope.species = [];
  $scope.traps = [];

  $scope.error = null;
  $scope.was_successful = false;
  $scope.success_message = null;

  $scope.year = null;
  $scope.month = null;
  $scope.week = null;
  $scope.state = null;
  $scope.county = null;
  $scope.spec = null;
  $scope.trap = null;
  $scope.individuals = null;
  $scope.pools = null;
  $scope.nights = null;
  $scope.wnv_results = null;
  $scope.comment = null;

  $scope.upload = false;
  $scope.fileToSend = null;
  $scope.filename = null;
  $scope.file_errors = [];

  $scope.toggleUpload = function() {
    $scope.upload = !$scope.upload;
    $scope.error = null;
    $scope.was_successful = false;
    if ($scope.upload) {
      $('#toggle-label').html('Manual Form');
      $('#toggle-icon').removeClass('fa-upload');
      $('#toggle-icon').addClass('fa-keyboard-o');
    }
    else {
      $('#toggle-label').html('Upload File');
      $('#toggle-icon').removeClass('fa-keyboard-o');
      $('#toggle-icon').addClass('fa-upload');
    }
  }

  function unhideElements() {
    $('.manual-form').removeClass('hidden');
    $('.upload-form').removeClass('hidden');
    $('#error-alert').removeClass('hidden');
    $('#success-alert').removeClass('hidden');
    setupFileUploader();
  }

  unhideElements();

  $http.get($scope.server+'/states').then(function(response) {
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

  $http.get($scope.server+'/species').then(function(response) {
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

  $http.get($scope.server+'/traps').then(function(response) {
    if (response.data.status === 200) {
      $('#trap').selectpicker();
      $scope.traps = response.data.traps;
      $timeout(function() {
        $('#trap').selectpicker('refresh');
      }, 1);
    }
    else {
      console.log(response.data.error);
    }
  });

  function populateCounties() {
    $http.get($scope.server+'/counties/'+$scope.state).then(function(response) {
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

  $scope.submitData = function() {
    $scope.was_successful = false;
    var state_re = /^[a-zA-Z]{2}$/;
    var comment_re = /^(\w| |-|@|!|&|\(|\)|#|_|\+|%|\^|\$|\*|'|\"|\?|\.)*$/;
    if ($scope.checkInput($scope.year,'number',null) && $scope.checkInput($scope.state,'string',state_re) && $scope.checkInput($scope.county,'number',null) && $scope.checkInput($scope.spec,'number',null) && $scope.checkInput($scope.trap,'number',null) && $scope.checkInput($scope.pools,'number',null) && $scope.checkInput($scope.wnv_results,'number',null)) {
      $scope.error = null;
      if (!$scope.comment || $scope.checkInput($scope.comment,'string',comment_re)) {
        var sumbmission = {
          "year": $scope.year,
          "month": $scope.month,
          "week": $scope.week,
          "state": $scope.state,
          "county": $scope.county,
          "species": $scope.spec,
          "trap": $scope.trap,
          "pools": $scope.pools,
          "individuals": $scope.individuals,
          "nights": $scope.nights,
          "wnv_results": $scope.wnv_results,
          "comment": $scope.comment
        };
        $.ajax({
          type: "POST",
          url: $scope.server+'/submit',
          data: sumbmission,
          success: function(data) {
            if (data.status === 201) {
              $scope.error = null;
              $scope.success_message = data.message;
              console.log($scope.success_message);
              clearForm();
            }
            else {
              $scope.error = data.error;
              console.log($scope.error);
            }
          }
        });
      }
      else {
        $scope.error = 'Invalid Comment';
      }
    }
    else {
      $scope.error = 'Invalid Fields: ';
      if (!$scope.checkInput($scope.year,'number',null)) {
        $scope.error += 'Year ';
      }
      if (!$scope.checkInput($scope.state,'string',state_re)) {
        $scope.error += 'State ';
      }
      if (!$scope.checkInput($scope.county,'number',null)) {
        $scope.error += 'County ';
      }
      if (!$scope.checkInput($scope.spec,'number',null)) {
        $scope.error += 'Species ';
      }
      if (!$scope.checkInput($scope.trap,'number',null)) {
        $scope.error += 'Trap ';
      }
      if (!$scope.checkInput($scope.pools,'number',null)) {
        $scope.error += 'Pools ';
      }
      if (!checkInput($scope.wnv_results,'number',null)) {
        $scope.error += 'WNV_Results ';
      }
    }
  }

  function clearForm() {
    $scope.was_successful = true;
    $scope.year = null;
    $scope.month = null;
    $scope.week = null;
    $scope.state = null;
    $scope.county = null;
    $scope.spec = null;
    $scope.trap = null;
    $scope.individuals = null;
    $scope.pools = null;
    $scope.nights = null;
    $scope.wnv_results = null;
    $scope.comment = null;
    $timeout(function() {
      $('.selectpicker').selectpicker('val','');
    }, 1);
  }

  function setupFileUploader() {
    $(document).on('change', ':file', function() {
      var input = $(this), numFiles = input.get(0).files ? input.get(0).files.length : 1;
      $scope.filename = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      if (!$scope.filename) {
        $scope.filename = 'none';
      }
      $('#filename-label').html($scope.filename);
      $scope.fileToSend = input.get(0).files[0];
    });
  }

  $scope.submitFile = function() {
    $scope.was_successful = false;
    var file_re = /^\w(\w|-|\.| ){0,250}\.csv$/;
    if ($scope.fileToSend) {
      $scope.file_errors = [];
      if (file_re.test($scope.filename.trim())) {
        $scope.error = null;
        var formData = new FormData();
        formData.append('mosquitoFile', $scope.fileToSend);
        $.ajax({
            url: $scope.server+'/submit/upload',
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success: function(data) {
              if (data.status === 202) {
                $('#upload_results').removeClass('hidden');
                $scope.error = null;
                $scope.fileToSend = null;
                $scope.filename = 'none';
                $('#filename-label').html($scope.filename);
                $scope.file_errors = data.errors;
                $scope.$apply();
              }
              else {
                $scope.error = data.error;
                console.log($scope.error);
              }
            }
        });
      }
      else {
        $scope.error = 'Invalid File Name';
      }
    }
    else {
      $scope.error = 'Please Select a File';
    }
  }

});
