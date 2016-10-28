'use strict';

let pg = require('pg');
let db_config = require('./secret_settings').db_config;
pg.defaults.ssl = require('./secret_settings').pg_ssl;

let db_pool = new pg.Pool(db_config);
console.log("connected to database");

const queries = require('./queries');

let pg_tool = {};

pg_tool.query = function(query_name, params, callback) {
  let result;
  if (query_name && params && callback && (typeof query_name) === 'string' && Array.isArray(params) && (typeof callback) === 'function') {
    let querystring = queries[query_name];
    let error = null;
    let rows = null;
    if (querystring) {
      db_pool.connect(function(err, client, done) {
        if (err) {
          console.log('error connecting to database: ', err)
          error = 'error connecting to database';
          callback(error, rows);
        }
        else {
          client.query(querystring, params, function(err, result) {
            done();
            if (err) {
              console.log('error querying database: ', err);
              error = 'error querying database',
              callback(error, rows);
            }
            else {
              rows = result.rows;
              callback(error, rows);
            }
          });
        }
      });
    }
    else {
      console.log('query does not exist');
      error = 'Invalid Query';
      callback(error, rows);
    }
  }
  else {
    console.log('invalid usage of db tool');
    result = {
      error: 'Invalid usage of DB_Tool',
      rows: null
    }
    return result;
  }
};

module.exports = pg_tool;
