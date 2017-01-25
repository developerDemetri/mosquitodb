'use strict';

angular.module('mosquitoApp').controller('accountController', function ($scope, $http, $window) {

  var name_re = /^\w{3,63}?$/;
  var password_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,63}?)$/;

  var err_msg = 'Invalid Field(s): ';
  var organization_re = /^(\w| |\.|'|-){2,255}?$/;
  var email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  $scope.error = null;
  $scope.isRegistering = false;

  $scope.loginName = null;
  $scope.pass = null;

  $scope.registerName = null;
  $scope.organization = null;
  $scope.email = null;
  $scope.pass1 = null;
  $scope.pass2 = null;

  $scope.login = function() {
    if ($scope.checkInput($scope.loginName, 'string', name_re) && $scope.checkInput($scope.pass, 'string', password_re)) {
        var account = {
          name: $scope.loginName.trim().toLowerCase(),
          password: $scope.pass
        };
        $http.post($scope.server+'/auth', account, null).then(
           function(response) {
             $scope.error = null;
             if (response.status === 200) {
               if (response.message === 'Successfully Authorized') {
                 $window.location.href = $scope.server+'/';
               }
               else {
                 $scope.error = 'Invalid Username/Password';
               }
             }
             else {
               $scope.error = 'Server Error!';
             }
           },
           function(response) {
             $scope.error = 'Server Error!';
           }
      );
    }
    else {
      $scope.error = 'Invalid Username/Password';
    }
  };

  $scope.register = function() {
    console.log('registering')
    if ($scope.registerName && $scope.organization && $scope.email && $scope.pass1 && $scope.pass2) {
      var errors = err_msg;
      if (!name_re.test($scope.registerName)) {
        errors += 'Username ';
      }
      if (!organization_re.test($scope.organization)) {
        errors += 'Organization ';
      }
      if (!email_re.test($scope.email)) {
        errors += 'Email ';
      }
      if (!password_re.test($scope.pass1)) {
        errors += 'Password ';
      }
      if ($scope.pass1 != $scope.pass2) {
        errors += 'Retyped-Password';
      }
      if (errors === err_msg) {
        var account = {
          name: $scope.registerName.trim().toLowerCase(),
          organization: $scope.organization.trim(),
          email: $scope.email.trim().toLowerCase(),
          password: $scope.pass1
        };
        $http.post($scope.server+'/account/register', account).then(
           function(response) {
             $scope.error = null;
             if (response.status === 201) {
               console.log('successfully created account');
               $window.location.href = $scope.server+'/';
             }
             else {
               $scope.error = 'Server Error!';
             }
           },
           function(response) {
             $scope.error = 'Server Error!';
           }
        );
      }
      else {
        $scope.error = errors.trim();
      }
    }
    else {
      $scope.error = 'Please fill all fields!';
    }
  };

  $scope.switchToRegistration = function() {
    $scope.error = null;
    $scope.isRegistering = true;
  };

  $scope.handleEnter = function(keyEvent) {
    if (keyEvent.which === 13) {
      if ($scope.isRegistering) {
        $scope.register();
      }
      else {
        $scope.login();
      }
    }
  };

});
