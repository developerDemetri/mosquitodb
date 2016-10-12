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
  res.render('home');
});

router.get('/about', function(req, res) {
  req.session.mdb_key = mdb_key;
  res.render('about');
});

router.get('/developer', function(req, res) {
  req.session.mdb_key = mdb_key;
  res.render('developer');
});

router.get('/states', function(req, res) {
  if (req.session.mdb_key === mdb_key) {
    pg_tool.query('SELECT code, name FROM mosquito.state', [], function(error, rows) {
      if (error) {
        let result = {
          "status": 500,
          "error": 'Server Error'
        };
        res.send(result);
      }
      else {
        let result = {
          "status": 200,
          "states": rows
        };
        res.send(result);
      }
    });
  }
  else {
    let result = {
      "status": 401,
      "error": 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.get('/counties/:state', function(req, res) {
  if (req.session.mdb_key === mdb_key) {
    let state_re = /^[a-zA-Z]{2}$/;
    if (checkInput(req.params.state,'string',state_re)) {
      let state = req.params.state + '';
      state = state.toUpperCase();
      pg_tool.query('SELECT id, name FROM mosquito.county WHERE state_code=$1 ORDER BY name ASC', [state], function(error, rows) {
        if (error) {
          let result = {
            "status": 500,
            "error": 'Server Error'
          };
          res.send(result);
        }
        else {
          let result = {
            "status": 200,
            "counties": rows
          };
          res.send(result);
        }
      });
    }
    else {
      let result = {
        "status": 400,
        "error": 'Invalid State Code'
      };
      res.send(result);
    }
  }
  else {
    let result = {
      "status": 401,
      "error": 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.get('/species', function(req, res) {
  if (req.session.mdb_key === mdb_key) {
    pg_tool.query('SELECT id, name FROM mosquito.species', [], function(error, rows) {
      if (error) {
        let result = {
          "status": 500,
          "error": 'Server Error'
        };
        res.send(result);
      }
      else {
        let result = {
          "status": 200,
          "species": rows
        };
        res.send(result);
      }
    });
  }
  else {
    let result = {
      "status": 401,
      "error": 'Unauthorized Request'
    };
    res.send(result);
  }
});

router.get('/traps', function(req, res) {
  if (req.session.mdb_key === mdb_key) {
    pg_tool.query('SELECT id, name FROM mosquito.trap', [], function(error, rows) {
      if (error) {
        let result = {
          "status": 500,
          "error": 'Server Error'
        };
        res.send(result);
      }
      else {
        let result = {
          "status": 200,
          "traps": rows
        };
        res.send(result);
      }
    });
  }
  else {
    let result = {
      "status": 401,
      "error": 'Unauthorized Request'
    };
    res.send(result);
  }
});

module.exports = router;
