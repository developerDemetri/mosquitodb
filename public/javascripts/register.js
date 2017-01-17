'use strict';

angular.module('mosquitoApp').controller('registerController', function ($scope, $http) {

  $scope.name = null;
  $scope.organization = null;
  $scope.email = null;
  $scope.pass1 = null;
  $scope.pass2 = null;

  var err_msg = 'Invalid Field(s): ';
  var name_re = /^\w{3,63}?$/;
  var password_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
  var organization_re = /^(\w| |\.|'|-){2,255}?$/;
  var email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  $scope.register = function() {
    if ($scope.name && $scope.organization && $scope.email && $scope.pass1 && $scope.pass2) {
      var errors = err_msg;
      if (!name_re.test($scope.name)) {
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
        console.log('creating account...');
        var account = {
          name: $scope.name.trim().toLowerCase(),
          organization: $scope.organization.trim(),
          email: $scope.email.trim().toLowerCase(),
          password: $scope.pass1
        };
        $.ajax({
          type: "POST",
          url: getServer()+'/register/register',
          data: account,
          success: function(data) {
            console.log(data);
            if (data.status === 201) {
              console.log('successfully created account')
            }
            else {
              console.log(data.error);
            }
          }
        });
      }
      else {
        console.log(errors.trim());
      }
    }
    else {
      console.log('missing fields')
    }
  };

});
