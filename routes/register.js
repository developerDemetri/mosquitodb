'use strict';

let app = require('../app');
let express = require('express');
let pg_tool = require('../bin/pg_tool');
let bcrypt = require('bcrypt-nodejs');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');
const mdb_key = require('../bin/secret_settings').api_settings.mdb_key;
let checkInput = require('../bin/validator_tool').checkInput;

const name_re = /^\w{3,63}?$/;
const password_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
const organization_re = /^(\w| |\.|'|-){2,255}?$/;
const email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let router = express.Router();

router.get('/', function(req, res) {
  try {
    req.session.mdb_key = mdb_key;
    res.status(200).render('register', {user: req.session.user});
  }
  catch (error) {
    console.log(error);
    res.status(500).render('error');
  }
});

router.post('/register', function(req, res) {
  try {
    if (req.session.mdb_key === mdb_key) {
      if (checkInput(req.body.name,'string',name_re) && checkInput(req.body.password,'string',password_re) && checkInput(req.body.organization,'string',organization_re) && checkInput(req.body.email,'string',email_re)) {
        let name = (req.body.name + '').trim();
        let password = bcrypt.hashSync(req.body.password);
        let organization = (req.body.organization + '').trim();
        let email = (req.body.email + '').trim();
        pg_tool.query('create_user', [name, password, organization, email], function(error, rows) {
          if (error) {
            console.log('ERROR creating user: ', error)
            res.status(400).send('ERROR creating user.');
          }
          else {
            res.status(201).send('User successfully created.');
          }
        });
      }
      else {
        res.status(400).send();
      }
    }
    else {
      res.status(401).send();
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
