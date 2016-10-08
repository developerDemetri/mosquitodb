'use strict';

let html_parser = require('htmlparser2');

function crawl() {
  let counties = [];
  // crawl wikipedia page //
  let maricopa = {
    name: 'Maricopa County',
    state: 'Arizona'
  };
  counties.push(maricopa);//TODO: just for testing //

  return counties;
}

module.exports.crawl = crawl;
