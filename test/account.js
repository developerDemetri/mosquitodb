'use strict';

let express = require('express');
let app = require('../app');
let request = require('supertest');
let assert = require('chai').assert;
let getCookies = require('./test_tool').getCookies;
