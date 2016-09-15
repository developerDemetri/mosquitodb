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


if (process.env.im_live) {
  console.log('loading prod settings..');
  pg_user = process.env.pg_user;
  pg_db = process.env.pg_db;
  pg_pass = process.env.pg_pass;
  pg_host = process.env.pg_host;
  pg_port = process.env.pg_port;
  sesh_name = process.env.sesh_name;
  sesh_secret = process.env.sesh_secret;
  pg_ssl = process.env.pg_ssl;
  redis_port = process.env.redis_port;
  redis_host = process.env.redis_host;
  redis_password = process.env.redis_password;
  mdb_api_key = process.env.mdb_api_key;
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
  pg_ssl = local_settings.pg_ssl;
  redis_port = local_settings.redis_port;
  redis_host = local_settings.redis_host;
  redis_password = local_settings.redis_password;
  mdb_api_key = local_settings.mdb_api_key;
}

let db_config = {
  user: pg_user,
  database: pg_db,
  password: pg_pass,
  host: pg_host,
  port: pg_port,
  max: 12,
  idleTimeoutMillis: 30000,
};

let session_config = {
  sesh_name: sesh_name,
  sesh_secret: sesh_secret
};

let api_settings = {
  mdb_key: mdb_api_key
};

let redis_config = {
  port: redis_port,
  host: redis_host,
  password: redis_password
};

let secret_settings = {
  db_config: db_config,
  session_config: session_config,
  pg_ssl: pg_ssl,
  api_settings: api_settings,
  redis_config: redis_config
};

module.exports = secret_settings;
