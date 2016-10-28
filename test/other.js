'use strict';

let assert = require('chai').assert;
let pg_tool = require('../bin/pg_tool');
let checkInput = require('../bin/validator_tool').checkInput;

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
      assert.equal(error, 'Invalid Query', 'bad query');
      done();
    });
  });
  it('Should execute valid query', function(done) {
    let query = 'get_states';
    let params = [];
    pg_tool.query(query, params, function(error, rows) {
      assert.isNotNull(rows);
      assert.isNull(error);
      done();
    });
  });
});

describe('Validator Tool', function() {
  let test_re = /^\w{3,5}$/;
  let test_input = null;
  it('Fails null input', function(done) {
    assert.isFalse(checkInput(test_input,'string',test_re));
    done();
  });
  it('Fails with empty regex', function(done) {
    test_input = 'hello_world';
    assert.isFalse(checkInput(test_input,'string',null));
    done();
  });
  it('Fails when not string type', function(done) {
    test_input = {
      "string": "yay"
    };
    assert.isFalse(checkInput(test_input,'string',test_re));
    done();
  });
  it('Fails if not matching regex', function(done) {
    test_input = 'hello world<dangerous script/>';
    assert.isFalse(checkInput(test_input,'string',test_re));
    done();
  });
  it('Passes if matching regex', function(done) {
    test_input = 'hello';
    assert.isNotFalse(checkInput(test_input,'string',test_re));
    done();
  });
  it('Fails when not number type', function(done) {
    test_input = {
      "string": "yay"
    };
    assert.isFalse(checkInput(test_input,'number',null));
    done();
  });
  it('Fails when not number convertable', function(done) {
    test_input = "hi";
    assert.isFalse(checkInput(test_input,'number',null));
    done();
  });
  it('Passes when number convertable', function(done) {
    test_input = "55";
    assert.isNotFalse(checkInput(test_input,'number',null));
    done();
  });
  it('Passes when number', function(done) {
    test_input = 55;
    assert.isNotFalse(checkInput(test_input,'number',null));
    done();
  });
});
