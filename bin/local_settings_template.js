'use strict';

// NEVER commit the real settings file to Git. EVER. //

const local_settings = {
  pg_user: null,
  pg_db: null,
  pg_pass: null,
  pg_host: null,
  pg_port: null,
  pg_ssl: null,
  sesh_name: null,
  sesh_secret: null,
  redis_port: 6379,
  redis_host: null,
  redis_password: null,
  redis_db: null,
  captcha_secret: null,
  mdb_api_key: null,
  test_user: null,
  test_pass: null
};

module.exports = local_settings;
