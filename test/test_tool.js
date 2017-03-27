'use strict';

let express = require('express');
let app = require('../app');
let request = require('supertest');
let assert = require('chai').assert;

const TEST_SETTINGS = require('../bin/secret_settings').test_settings;

let test_tool = {};

let cookies = null;

test_tool.getCookies = function(callback) {
  if (cookies) {
    callback(null, cookies);
  }
  else {
    request(app)
    .get('/')
    .end(function(err, res) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      cookies = res.headers['set-cookie'].pop().split(';')[0];
      let req = request(app).post('/account/auth');
      req.cookies = cookies;
      req.send({
          "name": TEST_SETTINGS.fake_user,
          "password": TEST_SETTINGS.fake_pass
        })
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.log(err);
            callback(err, null);
          }
          assert.isUndefined(res.body.error)
          assert.equal(res.body.status, 200, 'Valid Login');
          assert.equal(res.body.message, 'Successfully Authorized', 'Successfully Authorized');
          callback(null, cookies);
        });
    });
  }
};

module.exports = test_tool;
