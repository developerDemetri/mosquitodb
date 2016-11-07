'use strict';

let express = require('express');
let app = require('../app');
let request = require('supertest');
let assert = require('chai').assert;

describe('Should not allow cross-site submissions', function() {
  it('Should not allow manual submission', function(done) {
    request(app)
    .post('/submit')
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Unauthorized Request');
      assert.equal(res.body.status, 401, "denies submission");
      done();
    });
  });
  it('Should not allow upload submission', function(done) {
    let path = __dirname+'/test-submission.csv';
    request(app).post('/submit/upload')
    .attach('mosquitoFile', path)
    .end(function(err, res) {
      if (err) throw err;
      assert.equal(res.body.status, 401, "Should deny csv file");
      assert.equal(res.body.error, 'Unauthorized Request');
      done();
    });
  });
});

describe('Submitting Manual Form', function() {
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
  let test_sumbmission = {
          "year": 'hi',
          "month": 5,
          "week": 5,
          "state": 'az',
          "county": 1,
          "species": 1,
          "trap": 1,
          "pools": 1,
          "individuals": 1,
          "nights": 1,
          "wnv_results": 1,
          "comment": 'hi'
  };
  it('Should require valid year', function(done) {
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): year');
      assert.equal(res.body.status, 400, "should require valid year");
      done();
    });
  });
  it('Should require valid state', function(done) {
    test_sumbmission.year = 2016;
    test_sumbmission.state = 'asu';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): state');
      assert.equal(res.body.status, 400, "should require valid state");
      done();
    });
  });
  it('Should require valid county', function(done) {
    test_sumbmission.state = 'az';
    test_sumbmission.county = 'asu';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): county');
      assert.equal(res.body.status, 400, "should require valid county");
      done();
    });
  });
  it('Should require valid species', function(done) {
    test_sumbmission.county = 1;
    test_sumbmission.species = 'rawr';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): species');
      assert.equal(res.body.status, 400, "should require valid species");
      done();
    });
  });
  it('Should require valid trap', function(done) {
    test_sumbmission.species = 1;
    test_sumbmission.trap = 'wat';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): trap');
      assert.equal(res.body.status, 400, "should require valid trap");
      done();
    });
  });
  it('Should require valid wnv_results', function(done) {
    test_sumbmission.trap = 1;
    test_sumbmission.wnv_results = function() {conosole.log("KILL DATABASE!!!")};
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): wnv_results');
      assert.equal(res.body.status, 400, "should require valid wnv_results");
      done();
    });
  });
  it('Should require valid pools', function(done) {
    test_sumbmission.wnv_results = 1;
    test_sumbmission.pools = '\:';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): pools');
      assert.equal(res.body.status, 400, "should require valid pools");
      test_sumbmission.pools = 1;
      done();
    });
  });
  it('Should reject year out of range', function(done) {
    test_sumbmission.year = 2020;
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): year');
      assert.equal(res.body.status, 400, "should require valid year");
      test_sumbmission.year = 2016;
      done();
    });
  });
  it('Should require valid month if given', function(done) {
    test_sumbmission.month = 'hi';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): month');
      assert.equal(res.body.status, 400, "should require valid month");
      done();
    });
  });
  it('Should reject month out of range', function(done) {
    test_sumbmission.month = -13;
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): month');
      assert.equal(res.body.status, 400, "should require valid month");
      test_sumbmission.month = null;
      done();
    });
  });
  it('Should require valid week if given', function(done) {
    test_sumbmission.week = {
      stuff: 7
    };
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): week');
      assert.equal(res.body.status, 400, "should require valid week");
      done();
    });
  });
  it('Should reject week out of range', function(done) {
    test_sumbmission.week = 53;
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): week');
      assert.equal(res.body.status, 400, "should require valid week");
      test_sumbmission.week = null;
      done();
    });
  });
  it('Should reject pools out of range', function(done) {
    test_sumbmission.pools = -77;
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): pools');
      assert.equal(res.body.status, 400, "should require valid pools");
      done();
    });
  });
  it('Should invalid pools if given', function(done) {
    test_sumbmission.pools = 'seven';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): pools');
      assert.equal(res.body.status, 400, "should require valid pools");
      test_sumbmission.pools = 77;
      done();
    });
  });
  it('Should reject pools out of individuals', function(done) {
    test_sumbmission.individuals = -56;
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): individuals');
      assert.equal(res.body.status, 400, "should require valid individuals");
      done();
    });
  });
  it('Should require valid individuals if given', function(done) {
    test_sumbmission.individuals = 'ugh';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): individuals');
      assert.equal(res.body.status, 400, "should require valid individuals");
      test_sumbmission.individuals = null;
      done();
    });
  });
  it('Should reject nights out of range', function(done) {
    test_sumbmission.nights = -67;
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): nights');
      assert.equal(res.body.status, 400, "should require valid nights");
      done();
    });
  });
  it('Should require valid nights if given', function(done) {
    test_sumbmission.nights = 'meh';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): nights');
      assert.equal(res.body.status, 400, "should require valid nights");
      test_sumbmission.nights = null;
      done();
    });
  });
  it('Should reject wnv_results out of range', function(done) {
    test_sumbmission.wnv_results = -2;
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): wnv_results');
      assert.equal(res.body.status, 400, "should require valid wnv_results");
      test_sumbmission.wnv_results = 22;
      done();
    });
  });
  it('Should require valid comment if given', function(done) {
    test_sumbmission.comment = '--<malicous code>--DROP ALL TABLES--';
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.error, 'Invalid Parameter(s): comment');
      assert.equal(res.body.status, 400, "should require valid comment");
      test_sumbmission.comment = null;
      done();
    });
  });
  it('Should submit valid form', function(done) {
    let req = request(app).post('/submit');
    req.cookies = cookies;
    req.send(test_sumbmission)
    .end(function(err, res) {
      if (err) done(err);
      assert.equal(res.body.message, 'Collection Successfully Submitted');
      assert.equal(res.body.status, 201, "should require valid comment");
      done();
    });
  });
});

describe('Submitting CSV File', function() {
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
  it('Should require a file', function(done) {
    let req = request(app).post('/submit/upload');
    req.cookies = cookies;
    req.end(function(err, res) {
      if (err) throw err;
      assert.equal(res.body.status, 400, "Should require csv file");
      assert.equal(res.body.error, "Missing File");
      done();
    });
  });
  it('Should require a CSV file', function(done) {
    let req = request(app).post('/submit/upload');
    req.cookies = cookies;
    let path = __dirname+'/bad-submission.txt';
    req.attach('mosquitoFile', path)
    .end(function(err, res) {
      if (err) throw err;
      assert.equal(res.body.status, 400, "Should require csv file");
      assert.equal(res.body.error, "Invalid File");
      done();
    });
  });
  it('Partially correct CSV file should have some errors', function(done) {
    let req = request(app).post('/submit/upload');
    req.cookies = cookies;
    let path = __dirname+'/test-submission.csv';
    req.attach('mosquitoFile', path)
    .end(function(err, res) {
      if (err) throw err;
      assert.equal(res.body.status, 202, "Should accept valid csv file");
      assert.isNotNull(res.body.errors, "Some errors were found in csv file");
      assert.equal(res.body.errors.length, 3, "Exactly 3 errors in csv file");
      done();
    });
  });
});
