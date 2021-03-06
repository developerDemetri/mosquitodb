'use strict';

let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let pg_tool = require('./bin/pg_tool');
let redis_tool = require('./bin/redis_tool');
let session_tool = require('./bin/session_tool');

let index = require('./routes/index');
let submit = require('./routes/submit');
let account = require('./routes/account');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public'));
app.use(express.static('./public/stylesheets'));
app.use(express.static('./public/images'));
app.use(express.static('./public/javascripts'));
app.use(session_tool);

app.use('/', index);
app.use('/submit', submit);
app.use('/account', account);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req, res) {
  res.status(404).render('lost');
});

module.exports = app;
