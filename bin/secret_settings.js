'use strict';

const local_settings = require('./local_settings');

const pg_user = local_settings.pg_user;
const pg_db = local_settings.pg_db;
const pg_pass = local_settings.pg_pass;
const pg_host = local_settings.pg_host;
const pg_port = local_settings.pg_port;
const sesh_name = local_settings.sesh_name;
const sesh_secret = local_settings.sesh_secret;
const pg_ssl = local_settings.pg_ssl;
const redis_port = local_settings.redis_port;
const redis_host = local_settings.redis_host;
const redis_password = local_settings.redis_password;
const redis_db = local_settings.redis_db;
const mdb_api_key = local_settings.mdb_api_key;
const captcha_secret = local_settings.captcha_secret;
const test_user = local_settings.test_user;
const test_pass = local_settings.test_pass;


const db_config = {
  user: pg_user,
  database: pg_db,
  password: pg_pass,
  host: pg_host,
  port: pg_port,
  max: 12,
  idleTimeoutMillis: 30000,
};

const session_config = {
  sesh_name: sesh_name,
  sesh_secret: sesh_secret
};

const api_settings = {
  mdb_key: mdb_api_key,
  captcha_key: captcha_secret
};

const redis_config = {
  port: redis_port,
  host: redis_host,
  password: redis_password,
  db: redis_db
};

const test_settings = {
  fake_user: test_user,
  fake_pass: test_pass
};

const secret_settings = {
  db_config: db_config,
  session_config: session_config,
  pg_ssl: pg_ssl,
  api_settings: api_settings,
  redis_config: redis_config,
  test_settings: test_settings
};

module.exports = secret_settings;
