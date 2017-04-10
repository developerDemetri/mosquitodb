'use strict';

let Redis = require('ioredis');
const redis_config = require('./secret_settings').redis_config;
let logger = require('./logging_tool');

let redis_tool = new Redis({
  port: redis_config.port,
  host: redis_config.host,
  password: redis_config.password,
  db: redis_config.db
});

redis_tool.on('connect', function () {
  logger.info('connected to redis');
});

module.exports = redis_tool;
