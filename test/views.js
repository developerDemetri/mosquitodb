'use strict';

let chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest');
let express = require('express');
let app = require('../app');
let ejs = require('ejs');

describe('Views', function() {
  let spy = sinon.spy(ejs, '__express');
  it('Should return lost page when incorrect route is called', function(done) {
    request(app)
    .get('/derp')
    .end(function(err, res) {
      if (err) done(err);
      assert.isNotNull(res.body, 'got lost page');
      expect(spy.calledWithMatch(/\/views\/lost\.ejs$/)).to.be.true;
      done();
    });
  });
  it('Should return home page when home route is called', function(done) {
    request(app)
    .get('/')
    .end(function(err, res) {
      if (err) done(err);
      assert.isNotNull(res.body, 'got home page');
      expect(spy.calledWithMatch(/\/views\/home\.ejs$/)).to.be.true;
      done();
    });
  });
  it('Should return submit page when submit route is called', function(done) {
    request(app)
    .get('/submit')
    .end(function(err, res) {
      if (err) done(err);
      assert.isNotNull(res.body, 'got submit page');
      expect(spy.calledWithMatch(/\/views\/submit\.ejs$/)).to.be.true;
      done();
    });
  });
  it('Should return api page when api route is called', function(done) {
    request(app)
    .get('/api')
    .end(function(err, res) {
      if (err) done(err);
      assert.isNotNull(res.body, 'got api page');
      expect(spy.calledWithMatch(/\/views\/api\.ejs$/)).to.be.true;
      done();
    });
  });
  it('Should return about page when about route is called', function(done) {
    request(app)
    .get('/about')
    .end(function(err, res) {
      if (err) done(err);
      assert.isNotNull(res.body, 'got about page');
      expect(spy.calledWithMatch(/\/views\/about\.ejs$/)).to.be.true;
      done();
    });
  });
});
