'use strict';

function getServer() {
  return location.protocol + '//' + location.hostname + ':' + location.port;
}

angular.module('mosquitoApp', []);
