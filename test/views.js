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
});
