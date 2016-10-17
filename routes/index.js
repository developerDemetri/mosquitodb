'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
let mdb_key = require('../bin/secret_settings').api_settings.mdb_key;
let checkInput = require('../bin/validator_tool').checkInput;

const state_re = /^[a-zA-Z]{2}$/;

let router = express.Router();

router.get('/', function(req, res) {
  try {
    req.session.mdb_key = mdb_key;
    res.render('home');
  }
  catch (error) {
    console.log(error);
    res.render('error');
  }
});

router.get('/about', function(req, res) {
  try {
    req.session.mdb_key = mdb_key;
    res.render('about');
  }
  catch (error) {
    console.log(error);
    res.render('error');
  }
});

router.get('/api', function(req, res) {
  try {
    req.session.mdb_key = mdb_key;
    res.render('api');
  }
  catch (error) {
    console.log(error);
    res.render('error');
  }
});

router.get('/states', function(req, res) {
  let result;
  try {
    if (req.session.mdb_key === mdb_key) {
      pg_tool.query('get_states', [], function(error, rows) {
        if (error) {
          result = {
            "status": 500,
            "error": 'Server Error'
          };
          res.send(result);
        }
        else {
          result = {
            "status": 200,
            "states": rows
          };
          res.send(result);
        }
      });
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.send(result);
  }
});

router.get('/counties/:state', function(req, res) {
  let result;
  try {
    if (req.session.mdb_key === mdb_key) {
      if (checkInput(req.params.state,'string',state_re)) {
        let state = req.params.state + '';
        state = state.toUpperCase();
        pg_tool.query('get_counties', [state], function(error, rows) {
          if (error) {
            result = {
              "status": 500,
              "error": 'Server Error'
            };
            res.send(result);
          }
          else {
            result = {
              "status": 200,
              "counties": rows
            };
            res.send(result);
          }
        });
      }
      else {
        result = {
          "status": 400,
          "error": 'Invalid State Code'
        };
        res.send(result);
      }
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.send(result);
  }
});

router.get('/species', function(req, res) {
  let result;
  try {
    if (req.session.mdb_key === mdb_key) {
      pg_tool.query('get_species', [], function(error, rows) {
        if (error) {
          result = {
            "status": 500,
            "error": 'Server Error'
          };
          res.send(result);
        }
        else {
          result = {
            "status": 200,
            "species": rows
          };
          res.send(result);
        }
      });
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.send(result);
  }
});

router.get('/traps', function(req, res) {
  let result;
  try {
    if (req.session.mdb_key === mdb_key) {
      pg_tool.query('get_traps', [], function(error, rows) {
        if (error) {
          result = {
            "status": 500,
            "error": 'Server Error'
          };
          res.send(result);
        }
        else {
          result = {
            "status": 200,
            "traps": rows
          };
          res.send(result);
        }
      });
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.send(result);
  }
});

module.exports = router;
