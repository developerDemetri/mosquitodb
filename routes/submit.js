'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
const mdb_key = require('../bin/secret_settings').api_settings.mdb_key;
let checkInput = require('../bin/validator_tool').checkInput;

const state_re = /^[a-zA-Z]{2}$/;
const comment_re = /^(\w| |-|@|!|&|\(|\)|#|_|\+|%|\^|\$|\*|'|\"|\?|\.)*$/;

let router = express.Router();

router.get('/', function(req, res) {
  try {
    req.session.mdb_key = mdb_key;
    res.render('submit');
  }
  catch (error) {
    console.log(error);
    res.render('error');
  }
});

router.post('/', function(req, res) {
  let result;
  try {
    if (req.session.mdb_key === mdb_key) {
      if (checkInput(req.body.year,'number',null) && checkInput(req.body.state,'string',state_re) && checkInput(req.body.county,'number',null) && checkInput(req.body.species,'number',null) && checkInput(req.body.trap,'number',null) && checkInput(req.body.wnv_results,'number',null) && checkInput(req.body.pools,'number',null)) {
        let errs = 'Invalid Parameter(s): ';
        let curr_date = new Date();
        let year = Number(req.body.year);
        if (year < 1900 || year > curr_date.getFullYear()) {
          errs += 'year ';
        }
        let month = null;
        if (req.body.month) {
          if (checkInput(req.body.month,'number',null)) {
            month = Number(req.body.month);
            if (month < 1 || month > 12) {
              errs += 'month ';
            }
          }
          else {
            errs += 'month ';
          }
        }
        let week = null;
        if (req.body.week) {
          if (checkInput(req.body.week,'number',null)) {
            week = Number(req.body.week);
            if (week < 1 || week > 52) {
              errs += 'week ';
            }
          }
          else {
            errs += 'week ';
          }
        }
        let state = req.body.state + '';
        let county = Number(req.body.county);
        let species = Number(req.body.species);
        let trap = Number(req.body.trap);
        let pools = Number(req.body.pools);
        if (pools < 0) {
          errs += 'pools ';
        }
        let individuals = null;
        if (req.body.individuals) {
          if (checkInput(req.body.individuals,'number',null)) {
            individuals = Number(req.body.individuals);
            if (individuals < 0) {
              errs += 'individuals ';
            }
          }
        }
        let nights = null;
        if (req.body.nights) {
          if (checkInput(req.body.nights,'number',null)) {
            nights = Number(req.body.nights);
            if (nights < 1 || nights > 32766) {
              errs += 'nights ';
            }
          }
          else {
            errs += 'nights ';
          }
        }
        let wnv = Number(req.body.wnv_results);
        if (wnv < 0) {
          errs += 'wnv_results ';
        }
        let comment = null;
        if (req.body.comment) {
          if (checkInput(req.body.comment,'string',comment_re)) {
            comment = req.body.comment + '';
          }
          else {
            errs += 'comment ';
          }
        }
        if (errs === 'Invalid Parameter(s): ') {
          pg_tool.query('insert_collection', [year,month,week,state,county,trap,species,pools,individuals,nights,wnv,comment], function(error, rows) {
            if (error) {
              result = {
                "status": 500,
                "error": 'Server Error'
              };
              res.send(result);
            }
            else {
              result = {
                "status": 201,
                "message": "Collection Successfully Submitted"
              }
              res.send(result);
            }
          });
        }
        else {
          result = {
            "status": 400,
            "error": errs.trim()
          }
          res.send(result);
        }
      }
      else {
        result = {
          "status": 400,
          "error": "Invalid Parameter(s): "
        }
        if (!checkInput(req.body.year,'number',null)) {
          result.error += 'year ';
        }
        if (!checkInput(req.body.state,'string',state_re)) {
          result.error += 'state ';
        }
        if (!checkInput(req.body.county,'number',null)) {
          result.error += 'county ';
        }
        if (!checkInput(req.body.species,'number',null)) {
          result.error += 'species ';
        }
        if (!checkInput(req.body.trap,'number',null)) {
          result.error += 'trap ';
        }
        if (!checkInput(req.body.pools,'number',null)) {
          result.error += 'pools ';
        }
        if (!checkInput(req.body.wnv_results,'number',null)) {
          result.error += 'wnv_results ';
        }
        result.error = result.error.trim();
        res.send(result);
      }
    }
    else {
      result = {
        "status": 401,
        "error": "Unauthorized Request"
      }
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
