'use strict';

let express = require('express');
let app = require('../app');
let request = require('supertest');
let assert = require('chai').assert;

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
