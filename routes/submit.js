'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
let mdb_key = require('../bin/secret_settings').api_settings.mdb_key;
let checkInput = require('../bin/validator_tool').checkInput;

let router = express.Router();

router.get('/', function(req, res) {
  req.session.mdb_key = mdb_key;
  res.render('submit');
});

router.post('/', function(req, res) {
  let result;
  if (req.session.mdb_key === mdb_key) {
    //check inputs and then submit data//
    result = {
      "status": 201,
      "message": "Data Successfully Submitted"
    }
    res.send(result);
  }
  else {
    result = {
      "status": 401,
      "error": "Unauthorized Request"
    }
    res.send(result);
  }
});

module.exports = router;
