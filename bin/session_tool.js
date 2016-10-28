'use strict';

let uuid = require('node-uuid');
let session = require('express-session');
let redis_tool = require('./redis_tool');
let RedisStore = require('connect-redis')(session);
const session_config = require('./secret_settings').session_config;

const options = {
  client: redis_tool
};

const session_settings = {
  name: session_config.sesh_name,
  store: new RedisStore(options),
  genid: function(req) {
    return uuid.v4();
  },
  secret: session_config.sesh_secret,
  saveUninitialized: true,
  unset: 'destroy',
  resave: 'true'
};

let session_tool = session(session_settings);

module.exports = session_tool;
