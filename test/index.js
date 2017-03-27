'use strict';

let express = require('express');
let app = require('../app');
let request = require('supertest');
let assert = require('chai').assert;
let getCookies = require('./test_tool').getCookies;

describe('Should not allow cross-site calls', function() {
  it('Should not get states', function(done) {
    request(app)
    .get('/states')
    .end(function(err, res) {
      if (err) done(err);
      assert.isUndefined(res.body.states);
      assert.equal(res.body.status, 401, "denies states");
      done();
    });
  });
  it('Should not get counties', function(done) {
    request(app)
    .get('/counties/AZ')
    .end(function(err, res) {
      if (err) done(err);
      assert.isUndefined(res.body.counties);
      assert.equal(res.body.status, 401, "denies counties");
      done();
    });
  });
  it('Should not get species', function(done) {
    request(app)
    .get('/species')
    .end(function(err, res) {
      if (err) done(err);
      assert.isUndefined(res.body.species);
      assert.equal(res.body.status, 401, "denies species");
      done();
    });
  });
  it('Should not get traps', function(done) {
    request(app)
    .get('/traps')
    .end(function(err, res) {
      if (err) done(err);
      assert.isUndefined(res.body.traps);
      assert.equal(res.body.status, 401, "denies traps");
      done();
    });
  });
  it('Should not run search', function(done) {
    request(app)
    .get('/query')
    .end(function(err, res) {
      if (err) done(err);
      assert.isUndefined(res.body.traps);
      assert.equal(res.body.status, 401, "denies search");
      done();
    });
  });
});

describe('Allowed Value Retreival', function() {
  let cookies;
  it('Setting up cookies', function(done) {
    request(app)
      .get('/')
      .end(function(err, res) {
        if (err) done(err);
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
  });
  it('Should get states', function(done) {
    let req = request(app).get('/states');
    req.cookies = cookies;
    req.end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "gets states");
      assert.isArray(res.body.states);
      done();
    });
  });
  it('Should not get counties for invalid state', function(done) {
    let req = request(app).get('/counties/nyc');
    req.cookies = cookies;
    req.end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "does not get counties for nyc");
      assert.isUndefined(res.body.counties);
      done();
    });
  });
  it('Should get counties for valid state', function(done) {
    let req = request(app).get('/counties/az');
    req.cookies = cookies;
    req.end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "gets counties for az");
      assert.isArray(res.body.counties);
      done();
    });
  });
  it('Should get species', function(done) {
    let req = request(app).get('/species');
    req.cookies = cookies;
    req.end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "gets species");
      assert.isArray(res.body.species);
      done();
    });
  });
  it('Should get traps', function(done) {
    let req = request(app).get('/traps');
    req.cookies = cookies;
    req.end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "gets traps");
      assert.isArray(res.body.traps);
      done();
    });
  });
});

describe('Data queries', function() {
  let cookies;
  it('Setting up cookies', function(done) {
    request(app)
      .get('/')
      .end(function(err, res) {
        if (err) done(err);
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
  });
  let query = {};
  it('Blank Search', function(done) {
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs blank search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by bad dates', function(done) {
    query.start = 'hi';
    query.end = 'there';
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "fails date search");
      assert.isUndefined(res.body.results);
      done();
    });
  });
  it('Search by good dates', function(done) {
    query.start = 1996;
    query.end = 2016;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs date search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by bad state', function(done) {
    query.state = 808;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "fails state search");
      assert.isUndefined(res.body.results);
      done();
    });
  });
  it('Search by bad states', function(done) {
    query.state = ['AZ',808];
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "fails states search");
      assert.isUndefined(res.body.results);
      done();
    });
  });
  it('Search by good state', function(done) {
    query.state = 'AZ';
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs state search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by good states', function(done) {
    query.state = ['AZ','HI'];
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs states search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by bad county', function(done) {
    query.county = 'derp';
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "fails county search");
      assert.isUndefined(res.body.results);
      done();
    });
  });
  it('Search by bad counties', function(done) {
    query.county = [3,'nope'];
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "fails counties search");
      assert.isUndefined(res.body.results);
      done();
    });
  });
  it('Search by good county', function(done) {
    query.county = 3;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs county search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by good counties', function(done) {
    query.county = [3,5];
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs counties search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by bad species', function(done) {
    query.species = 'wat';
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "fails species search");
      assert.isUndefined(res.body.results);
      done();
    });
  });
  it('Search by multiple bad species', function(done) {
    query.species = [2,'hey'];
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 400, "fails multiple species search");
      assert.isUndefined(res.body.results);
      done();
    });
  });
  it('Search by good species', function(done) {
    query.species = 2;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs species search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by multiple good species', function(done) {
    query.species = [2,4];
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs multiple species search");
      assert.isArray(res.body.results);
      done();
    });
  });
  /*
  * These next few test have no effect on code coverage.
  * They are testing the untested query strings in bin/queries.js
  */
  it('Search by species and counties only', function(done) {
    query.state = null;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs species and counties only search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by species and states only', function(done) {
    query.state = 'AZ';
    query.county = null;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs species and states only search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by states and counties only', function(done) {
    query.county = 2;
    query.species = null;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs states and counties only search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by counties only', function(done) {
    query.state = null;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs counties only search");
      assert.isArray(res.body.results);
      done();
    });
  });
  it('Search by species only', function(done) {
    query.county = null;
    query.species = 4;
    let req = request(app).get('/query');
    req.cookies = cookies;
    req.query(query).end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.status, 200, "runs counties only search");
      assert.isArray(res.body.results);
      done();
    });
  });
});
