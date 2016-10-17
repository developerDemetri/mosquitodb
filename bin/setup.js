'use strict';

let pg_tool = require('./pg_tool');
let async_loop = require('node-async-loop');

const allowed_values = require('./allowed_values');
const counties_list = require('./county_parser').crawl();

function createSchema() {
  console.log('Creating Schema...');
  pg_tool.query('create_query', [], function(error, rows) {
    if (error) {
      console.log('ERROR Creating Schema: ', error);
      process.exit(1);
    }
    else {
      console.log('Schema successfully created.');
      insertTraps();
    }
  });
}

function insertTraps() {
  console.log('Inserting traps...');
  let traps = allowed_values.trap_list;
  if (Object.keys(traps).length > 0) {
    async_loop(traps, function (item, next) {
      pg_tool.query('trap_insert_query', [item.key, item.value], function(error, rows) {
        if (error) {
          console.log('ERROR Inserting Traps: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      console.log('Traps inserted.');
      insertSpecies();
    });
  }
  else {
    console.log('ERROR Inserting Traps: trap list is empty.');
    process.exit(1);
  }
}

function insertSpecies() {
  let species = allowed_values.species_list;
  if (species.length > 0) {
    async_loop(species, function (item, next) {
      pg_tool.query('species_insert_query', [item], function(error, rows) {
        if (error) {
          console.log('ERROR Inserting Species: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      console.log('Species inserted.');
      insertStates();
    });
  }
  else {
    console.log('ERROR Inserting Species: species list is empty.');
    process.exit(1);
  }
}

function insertStates() {
  let states = allowed_values.state_list;
  console.log('Inserting states...');
  if (Object.keys(states).length > 0) {
    async_loop(states, function (item, next) {
      pg_tool.query('state_insert_query', [item.value, item.key], function(error, rows) {
        if (error) {
          console.log('ERROR Inserting States: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      console.log('States inserted.');
      insertCounties();
    });
  }
  else {
    console.log('ERROR Inserting States: state list is empty.');
    process.exit(1);
  }
}

function insertCounties() {
  console.log('Inserting counties...');
  if (counties_list.length > 0) {
    async_loop(counties_list, function (item, next) {
      let state_code = allowed_values.state_list[item.state];
      pg_tool.query('county_insert_query', [item.name, state_code], function(error, rows) {
        if (error) {
          console.log('ERROR Inserting Counties: ', error);
          process.exit(1);
        }
        else {
          next();
        }
      });
    }, function () {
      console.log('Counties inserted.');
      console.log('Fresh DB setup.');
      process.exit(0);
    });
  }
  else {
    console.log('ERROR Inserting Counties: counties list is empty.');
    process.exit(1);
  }
}

// setup script //
console.log('Setting up fresh DB...');
createSchema();
