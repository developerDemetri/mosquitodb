'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
const mdb_key = require('../bin/secret_settings').api_settings.mdb_key;
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
          res.status(result.status).send(result);
        }
        else {
          result = {
            "status": 200,
            "states": rows
          };
          res.status(result.status).send(result);
        }
      });
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.status(result.status).send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.status(result.status).send(result);
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
            res.status(result.status).send(result);
          }
          else {
            result = {
              "status": 200,
              "counties": rows
            };
            res.status(result.status).send(result);
          }
        });
      }
      else {
        result = {
          "status": 400,
          "error": 'Invalid State Code'
        };
        res.status(result.status).send(result);
      }
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.status(result.status).send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.status(result.status).send(result);
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
          res.status(result.status).send(result);
        }
        else {
          result = {
            "status": 200,
            "species": rows
          };
          res.status(result.status).send(result);
        }
      });
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.status(result.status).send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.status(result.status).send(result);
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
          res.status(result.status).send(result);
        }
        else {
          result = {
            "status": 200,
            "traps": rows
          };
          res.status(result.status).send(result);
        }
      });
    }
    else {
      result = {
        "status": 401,
        "error": 'Unauthorized Request'
      };
      res.status(result.status).send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.status(result.status).send(result);
  }
});

router.get('/query', function(req, res) {
  let result;
  try {
    let start = null;
    let end = null;
    let states = null;
    let counties = null;
    let species = null;
    let errors = '';
    if (req.query.start) {
      if (checkInput(req.query.start,'number',null)) {
        start = Number(req.query.start);
      }
      else {
        errors += 'start ';
      }
    }
    else {
      start = 1900;
    }
    if (req.query.end) {
      if (checkInput(req.query.end,'number',null)) {
        end = Number(req.query.end);
      }
      else {
        errors += 'end ';
      }
    }
    else {
      end = 2017;
    }
    if (req.query.state) {
      states = [];
      if (Array.isArray(req.query.state) && req.query.state.length > 0) {
        for (let i = 0; i < req.query.state.length; i++) {
          if (checkInput(req.query.state[i],'string',state_re)) {
            states.push((req.query.state[i] + '').trim());
          }
          else {
            errors += 'state ';
            i = req.query.state.length;
          }
        }
      }
      else if (checkInput(req.query.state,'string',state_re)) {
        states.push((req.query.state + '').trim());
      }
      else {
        errors += 'state ';
      }
    }
    if (req.query.county) {
      counties = [];
      if (Array.isArray(req.query.county) && req.query.county.length > 0) {
        for (let i = 0; i < req.query.county.length; i++) {
          if (checkInput(req.query.county[i],'number',null)) {
            counties.push(Number(req.query.county[i]));
          }
          else {
            errors += 'county ';
            i = req.query.county.length;
          }
        }
      }
      else if (checkInput(req.query.county,'number',null)) {
        counties.push(Number(req.query.county));
      }
      else {
        errors += 'county ';
      }
    }
    if (req.query.species) {
      species = [];
      if (Array.isArray(req.query.species) && req.query.species.length > 0) {
        for (let i = 0; i < req.query.species.length; i++) {
          if (checkInput(req.query.species[i],'number',null)) {
            species.push(Number(req.query.species[i]));
          }
          else {
            errors += 'species ';
            i = req.query.species.length;
          }
        }
      }
      else if (checkInput(req.query.species,'number',null)) {
        species.push(Number(req.query.species));
      }
      else {
        errors += 'species ';
      }
    }
    if (errors) {
      result = {
        "status": 400,
        "error": 'Invalide Query Option(s): ' + errors.trim()
      };
      res.status(result.status).send(result);
    }
    else {
      let query = 'search_by_dates';
      let params = [start,end];
      if (states) {
        query += ' states';
        params.push(states);
      }
      if (counties) {
        query += ' counties';
        params.push(counties);
      }
      if (species) {
        query += ' species';
        params.push(species);
      }
      query = query.trim().replace(/ /g, "_");
      pg_tool.query(query, params, function(error, rows) {
        if (error) {
          result = {
            "status": 500,
            "error": 'Server Error'
          };
          res.status(result.status).send(result);
        }
        else {
          result = {
            "status": 200,
            "results": rows
          }
          res.status(result.status).send(result);
        }
      });
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.status(result.status).send(result);
  }
});

module.exports = router;
