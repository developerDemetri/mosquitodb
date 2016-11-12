'use strict';

let pg_user;
let pg_db;
let pg_pass;
let pg_host;
let pg_port;
let pg_ssl;

let sesh_name;
let sesh_secret;

let redis_port;
let redis_host;
let redis_password;

let mdb_api_key;
let captcha_secret;


if (process.env.im_live) {
  console.log('loading prod settings..');
  let pg_url = process.env.DATABASE_URL.split(':');
  pg_user = pg_url[1].substring(2);
  pg_db = pg_url[3].split('/')[1];
  pg_pass = pg_url[2].split('@')[0];
  pg_host = pg_url[2].split('@')[1];
  pg_port = pg_url[3].split('/')[0];
  sesh_name = process.env.sesh_name;
  sesh_secret = process.env.sesh_secret;
  pg_ssl = true;
  let redis_url = process.env.REDIS_URL.split(':');
  redis_port = redis_url[3];
  redis_host = redis_url[2].split('@')[1];
  redis_password = redis_url[2].split('@')[0];
  mdb_api_key = process.env.mdb_api_key;
  captcha_secret = process.env.captcha_secret;
}
else {
  console.log('loading local settings..');
  let local_settings = require('./local_settings');
  pg_user = local_settings.pg_user;
  pg_db = local_settings.pg_db;
  pg_pass = local_settings.pg_pass;
  pg_host = local_settings.pg_host;
  pg_port = local_settings.pg_port;
  sesh_name = local_settings.sesh_name;
  sesh_secret = local_settings.sesh_secret;
  pg_ssl = false;
  redis_port = local_settings.redis_port;
  redis_host = local_settings.redis_host;
  redis_password = local_settings.redis_password;
  mdb_api_key = local_settings.mdb_api_key;
  captcha_secret = local_settings.captcha_secret;
}

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
  password: redis_password
};

const secret_settings = {
  db_config: db_config,
  session_config: session_config,
  pg_ssl: pg_ssl,
  api_settings: api_settings,
  redis_config: redis_config
};

module.exports = secret_settings;
