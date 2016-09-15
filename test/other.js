'use strict';

let chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;
let pg_tool = require('../bin/pg_tool');

describe('PG Tool', function() {
  it('Should require all parameters', function(done) {
    let query = '';
    let params = [];
    let callback = null;
    let response = pg_tool.query(query, params, callback);
    assert.isNotNull(response);
    assert.equal(response.error, 'Invalid usage of DB_Tool', 'valid usage of db tool');
    assert.isNull(response.rows);
    done();
  });
  it('Should require valid querystring', function(done) {
    let query = 5;
    let params = [];
    let callback = function(error, rows) {};
    let response = pg_tool.query(query, params, callback);
    assert.isNotNull(response);
    assert.equal(response.error, 'Invalid usage of DB_Tool', 'valid usage of db tool');
    assert.isNull(response.rows);
    done();
  });
  it('Should require valid params', function(done) {
    let query = 'SELECT COUNT(username) FROM public.bwf_user';
    let params = 'hi';
    let callback = function(error, rows) {};
    let response = pg_tool.query(query, params, callback);
    assert.isNotNull(response);
    assert.equal(response.error, 'Invalid usage of DB_Tool', 'valid usage of db tool');
    assert.isNull(response.rows);
    done();
  });
  it('Should require valid callback', function(done) {
    let query = 'SELECT COUNT(username) FROM public.bwf_user';
    let params = [];
    let callback = 'stuff';
    let response = pg_tool.query(query, params, callback);
    assert.isNotNull(response);
    assert.equal(response.error, 'Invalid usage of DB_Tool', 'valid usage of db tool');
    assert.isNull(response.rows);
    done();
  });
  it('Should not execute invalid query', function(done) {
    let query = 'SELECT derp FROM stuff';
    let params = [];
    pg_tool.query(query, params, function(error, rows) {
      assert.isNotNull(error);
      assert.isNull(rows);
      assert.equal(error, 'error querying database', 'bad query');
      done();
    });
  });
  // it('Should execute valid query', function(done) {
  //   let query = '';
  //   let params = [];
  //   pg_tool.query(query, params, function(error, rows) {
  //     assert.isNotNull(rows);
  //     assert.isNull(error);
  //     done();
  //   });
  // });
});
