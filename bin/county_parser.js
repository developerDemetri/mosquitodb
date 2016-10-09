'use strict';

let fs = require('fs');
let cheerio = require('cheerio');

function isEmpty(str) {
  if (str.trim() === '') {
    return false;
  }
  return true;
}

function crawl() {
  let counties = [];
  console.log('Parsing wikipedia page...');
  let wiki_html = fs.readFileSync('bin/us_counties_wikipedia.html').toString();
  let $ = cheerio.load(wiki_html);
  let raw_list = $('body').find('ol').text();
  raw_list = raw_list.substring(0,raw_list.indexOf('^')).split("\n").filter(isEmpty);
  for (let i = 0; i < raw_list.length; i++) {
    let county_parts = raw_list[i].split(',');
    if (county_parts[1].indexOf('[') > 0) {
      county_parts[1] = county_parts[1].split('[')[0];
    }
    let county = {
      name: county_parts[0].trim(),
      state: county_parts[1].trim()
    };
    counties.push(county);
  }
  console.log('Done parsing wikipedia page.');
  return counties;
}

module.exports.crawl = crawl;
