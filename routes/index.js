'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
let mdb_key = require('../bin/secret_settings').api_settings.mdb_key;

let router = express.Router();

router.get('/', function(req, res) {
  req.session.mdb_key = mdb_key;
  res.render('home');
});

module.exports = router;
