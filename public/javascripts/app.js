'use strict';

function getServer() {
  return location.protocol + '//' + location.hostname + ':' + location.port;
}

function checkInput(input, type, regex) {
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
}

angular.module('mosquitoApp', []);
