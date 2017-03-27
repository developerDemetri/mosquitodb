'use strict';

let pg_tool = require('./pg_tool');
let async_loop = require('node-async-loop');
let logger = require('./logging_tool');

const allowed_values = require('./allowed_values');
const counties_list = require('./counties');


function createSchema() {
  logger.info('Creating Schema...');
  pg_tool.query('create_query', [], function(error, rows) {
    if (error) {
      logger.error('ERROR Creating Schema: ', error);
      process.exit(1);
    }
    else {
      logger.info('Schema successfully created.');
      insertTraps();
    }
  });
}

function insertTraps() {
  logger.info('Inserting traps...');
  let traps = allowed_values.trap_list;
  if (Object.keys(traps).length > 0) {
    async_loop(traps, function (item, next) {
      pg_tool.query('trap_insert_query', [item.key, item.value], function(error, rows) {
        if (error) {
          logger.error('ERROR Inserting Traps: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      logger.info('Traps inserted.');
      insertSpecies();
    });
  }
  else {
    logger.error('ERROR Inserting Traps: trap list is empty.');
    process.exit(1);
  }
}

function insertSpecies() {
  let species = allowed_values.species_list;
  if (species.length > 0) {
    async_loop(species, function (item, next) {
      pg_tool.query('species_insert_query', [item], function(error, rows) {
        if (error) {
          logger.error('ERROR Inserting Species: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      logger.info('Species inserted.');
      insertStates();
    });
  }
  else {
    logger.error('ERROR Inserting Species: species list is empty.');
    process.exit(1);
  }
}

function insertStates() {
  let states = allowed_values.state_list;
  logger.info('Inserting states...');
  if (Object.keys(states).length > 0) {
    async_loop(states, function (item, next) {
      pg_tool.query('state_insert_query', [item.value, item.key], function(error, rows) {
        if (error) {
          logger.error('ERROR Inserting States: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      logger.info('States inserted.');
      insertCounties();
    });
  }
  else {
    logger.error('ERROR Inserting States: state list is empty.');
    process.exit(1);
  }
}

function insertCounties() {
  logger.info('Inserting counties...');
  if (counties_list.length > 0) {
    async_loop(counties_list, function (item, next) {
      let state_code = allowed_values.state_list[item.state];
      pg_tool.query('county_insert_query', [item.name, state_code], function(error, rows) {
        if (error) {
          logger.error('ERROR Inserting Counties: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      logger.info('Counties inserted.');
      logger.info('Fresh DB setup.');
      process.exit(0);
    });
  }
  else {
    logger.error('ERROR Inserting Counties: counties list is empty.');
    process.exit(1);
  }
}

// setup script //
logger.info('Setting up fresh DB...');
createSchema();
