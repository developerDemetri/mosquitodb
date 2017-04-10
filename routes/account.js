'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let bcrypt = require('bcrypt-nodejs');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
const mdb_key = require('../bin/secret_settings').api_settings.mdb_key;
let checkInput = require('../bin/validator_tool').checkInput;
let logger = require('../bin/logging_tool');

const name_re = /^\w{3,63}?$/;
const password_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,63}?)$/;
const organization_re = /^(\w| |\.|'|-){2,255}?$/;
const email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let router = express.Router();

router.get('/', function(req, res) {
  if (req.session.mdb_key === mdb_key && checkInput(req.session.user, 'string', name_re)) {
    res.status(302).render('home', {user: req.session.user});
  }
  else {
    req.session.mdb_key = mdb_key;
    res.status(200).render('account', {user: req.session.user});
  }
});

router.post('/auth', function(req, res) {
  try {
    let result;
    if (req.session.mdb_key === mdb_key) {
      if (checkInput(req.body.name, 'string', name_re) && checkInput(req.body.password, 'string', password_re)) {
        const name = req.body.name + '';
        pg_tool.query('get_user_password', [name], function(error, rows) {
          if (!error) {
            if (rows && rows[0] && bcrypt.compareSync(req.body.password, rows[0].password)) {
              req.session.user = name;
              result = {
                "status": 200,
                "message": 'Successfully Authorized'
              };
              res.status(result.status).send(result);
            }
            else {
              result = {
                "status": 200,
                "message": 'Invalid Username/Password'
              };
              res.status(result.status).send(result);
            }
          }
          else {
            logger.error(error);
            result = {
              "status": 500,
              "error": 'Server Error'
            };
            res.status(result.status).send(result);
          }
        });
      }
      else {
        result = {
          "status": 400,
          "error": 'Invalid Username/Password'
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
    logger.error(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.status(result.status).send(result);
  }
});

router.post('/register', function(req, res) {
  try {
    let result;
    if (req.session.mdb_key === mdb_key) {
      if (checkInput(req.body.name,'string',name_re) && checkInput(req.body.password,'string',password_re) && checkInput(req.body.organization,'string',organization_re) && checkInput(req.body.email,'string',email_re)) {
        let name = (req.body.name + '').trim();
        let password = bcrypt.hashSync(req.body.password);
        let organization = (req.body.organization + '').trim();
        let email = (req.body.email + '').trim();
        pg_tool.query('create_user', [name, password, organization, email], function(error, rows) {
          if (error) {
            logger.error('ERROR creating user: ', error)
            result = {
              "status": 400,
              "error": 'Bad Request'
            };
            res.status(result.status).send(result);
          }
          else {
            req.session.user = name;
            result = {
              "status": 201,
              "message": 'User Successfully Created'
            };
            res.status(result.status).send(result);
          }
        });
      }
      else {
        result = {
          "status": 400,
          "error": 'Bad Request'
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
    logger.error(error);
    result = {
      "status": 500,
      "error": "Server Error"
    }
    res.status(result.status).send(result);
  }
});

router.delete('/logout', function(req, res) {
  if (req.session.mdb_key === mdb_key && checkInput(req.session.user, 'string', name_re)) {
    req.session.user = null;
    req.session.destroy();
    let result = {
      "status": 200,
      "error": 'Session Ended'
    };
    res.status(result.status).send(result);
  }
  else {
    let result = {
      "status": 401,
      "error": 'Unauthorized Request'
    };
    res.status(result.status).send(result);
  }
});

module.exports = router;
