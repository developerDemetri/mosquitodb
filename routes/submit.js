'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
const mdb_key = require('../bin/secret_settings').api_settings.mdb_key;
let checkInput = require('../bin/validator_tool').checkInput;
let multer  = require('multer');
let upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1000000 //1MB
  }
});
let fs = require('fs');
let csv = require('csv-parse');
let async_loop = require('node-async-loop');

const name_re = /^\w{3,63}?$/;
const state_re = /^[a-zA-Z]{2}$/;
const comment_re = /^(\w| |-|@|!|&|\(|\)|#|_|\+|%|\^|\$|\*|'|\"|\?|\.)*$/;
const file_re = /^\w(\w|-|\.| ){0,250}\.csv$/;
const base_error = 'Invalid Parameter(s): ';

let router = express.Router();

function isAuthorized(req) {
  return (req.session.mdb_key === mdb_key && checkInput(req.user, 'string', name_re));
};

router.get('/', function(req, res) {
  try {
    if (isAuthorized(req)) {
      res.status(200).render('submit', {user: req.session.user});
    }
    else {
      res.status(302).redirect('/account');
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).render('error');
  }
});

router.post('/', function(req, res) {
  let result;
  try {
    if (isAuthorized(req)) {
      if (checkInput(req.body.year,'number',null) && checkInput(req.body.state,'string',state_re) && checkInput(req.body.county,'number',null) && checkInput(req.body.species,'number',null) && checkInput(req.body.trap,'number',null) && checkInput(req.body.wnv_results,'number',null) && checkInput(req.body.pools,'number',null)) {
        let errs = base_error;
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
        let state = (req.body.state + '').toUpperCase();
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
          else {
            errs += 'individuals ';
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
        if (errs === base_error) {
          pg_tool.query('insert_collection', [year,month,week,state,county,trap,species,pools,individuals,nights,wnv,comment], function(error, rows) {
            if (error) {
              result = {
                "status": 500,
                "error": 'Server Error'
              };
              res.status(result.status).send(result);
            }
            else {
              result = {
                "status": 201,
                "message": "Collection Successfully Submitted"
              }
              res.status(result.status).send(result);
            }
          });
        }
        else {
          result = {
            "status": 400,
            "error": errs.trim()
          }
          res.status(result.status).send(result);
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
        res.status(result.status).send(result);
      }
    }
    else {
      result = {
        "status": 401,
        "error": "Unauthorized Request"
      }
      res.status(result.status).send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    };
    res.status(result.status).send(result);
  }
});

router.post('/upload', upload.single('mosquitoFile'), function (req, res) {
  let result;
  try {
    if (isAuthorized(req)) {
      if (req.file) {
        if (file_re.test(req.file.originalname)) {
          let submissions = [];
          let errors = [];
          let line_num = 0;
          fs.createReadStream(req.file.path).pipe(csv())
          .on('data', function(line) {
            if (line && line[0] != 'year') {
              line_num++;
              try {
                let line_error = base_error;
                let submission = {
                  "line": line_num,
                  "year": null,
                  "month": null,
                  "week": null,
                  "state": null,
                  "county": null,
                  "species": null,
                  "trap": null,
                  "pools": null,
                  "individuals": null,
                  "nights": null,
                  "wnv": null,
                  "comment": null
                };
                if (checkInput(line[0],'number',null)) {
                  submission.year = Number(line[0]);
                }
                else {
                  line_error += "year ";
                }
                if (line[1]) {
                  if (checkInput(line[1],'number',null)) {
                    submission.month = Number(line[1]);
                  }
                  else {
                    line_error += "month ";
                  }
                }
                if (line[2]) {
                  if (checkInput(line[2],'number',null)) {
                    submission.week = Number(line[2]);
                  }
                  else {
                    line_error += "week ";
                  }
                }
                if (checkInput(line[3].trim(),'string',state_re)) {
                  submission.state = (line[3].trim() + "").toUpperCase();
                }
                else {
                  line_error += "state ";
                }
                if (checkInput(line[4],'number',null)) {
                  submission.county = Number(line[4]);
                }
                else {
                  line_error += "county ";
                }
                if (checkInput(line[5],'number',null)) {
                  submission.species = Number(line[5]);
                }
                else {
                  line_error += "species ";
                }
                if (checkInput(line[6],'number',null)) {
                  submission.trap = Number(line[6]);
                }
                else {
                  line_error += "trap ";
                }
                if (checkInput(line[7],'number',null)) {
                  submission.pools = Number(line[7]);
                }
                else {
                  line_error += "pools ";
                }
                if (line[8]) {
                  if (checkInput(line[8],'number',null)) {
                    submission.individuals = Number(line[8]);
                  }
                  else {
                    line_error += "individuals ";
                  }
                }
                if (line[9]) {
                  if (checkInput(line[9],'number',null)) {
                    submission.nights = Number(line[9]);
                  }
                  else {
                    line_error += "nights ";
                  }
                }
                if (checkInput(line[10],'number',null)) {
                  submission.wnv = Number(line[10]);
                }
                else {
                  line_error += "wnv ";
                }
                if (line[11]) {
                  if (checkInput(line[11],'string',comment_re)) {
                    submission.comment = line[11].trim() + "";
                  }
                  else {
                    line_error += "comment ";
                  }
                }
                if (line_error === base_error) {
                  submissions.push(submission);
                }
                else {
                  errors.push({
                    line: line_num,
                    error: line_error
                  });
                }
              }
              catch (err) {
                console.log(err);
                errors.push({
                  line: line_num,
                  error: 'Error Parsing Line'
                });
              }
            }
          })
          .on('end',function() {
            console.log('done reading csv');
            processSubmissions(submissions, function(errs) {
              for (let i = 0; i < errs.length; i++) {
                errors.push(errs[i]);
              }
              fs.unlink(req.file.path, function(err) {
                if (err) {
                  console.log("Error Deleting File: ",err);
                }
              });
              result = {
                "status": 202,
                "message": "File Successfully Submitted",
                "errors": errors
              };
              res.status(result.status).send(result);
            });
          });
        }
        else {
          result = {
            "status": 400,
            "error": "Invalid File"
          };
          res.status(result.status).send(result);
        }
      }
      else {
        result = {
          "status": 400,
          "error": "Missing File"
        };
        res.status(result.status).send(result);
      }
    }
    else {
      fs.unlink(req.file.path, function(err) {
        console.log(err);
      });
      result = {
        "status": 401,
        "error": "Unauthorized Request"
      }
      res.status(result.status).send(result);
    }
  }
  catch (error) {
    console.log(error);
    result = {
      "status": 500,
      "error": "Server Error"
    };
    res.status(result.status).send(result);
  }
});

function processSubmissions(submissions, callback) {
  let errors = [];
  async_loop(submissions, function (submission, next) {
    if (submission) {
      try {
        pg_tool.query('insert_collection', [submission.year,submission.month,submission.week,submission.state,submission.county,submission.trap,submission.species,submission.pools,submission.individuals,submission.nights,submission.wnv,submission.comment], function(error, rows) {
          if (error) {
            console.log('CSV Insertion Error: ',error);
            let err = {
              "line": submission.line,
              "error": 'Database Error'
            };
            errors.push(err);
          }
          next();
        });
      }
      catch (error) {
        console.log('CSV Insertion Error: ',error);
        let err = {
          "line": submission.line,
          "error": 'Database Error'
        };
        errors.push(err);
        rollbackSubmission(1);//TODO: need batch id
        callback(errors);
      }
    }
  }, function () {
    callback(errors);
  });
};

function rollbackSubmission(batch_id) {
  console.log('rolling back submission for batch: ', batch_id);
  //TODO: rollback batch
};

module.exports = router;
