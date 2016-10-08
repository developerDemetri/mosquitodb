'use strict';

let pg_tool = require('./pg_tool');

const allowed_values = require('./allowed_values');
const counties_list = require('./county_parser').crawl();

const trap_insert_query = ' INSERT INTO mosquito.trap (name, comment) VALUES ($1, $2)';
const species_insert_query = 'INSERT INTO mosquito.species (name) VALUES ($1)';
const state_insert_query = 'INSERT INTO mosquito.state (code, name) VALUES ($1,$2)';
const county_insert_query = 'INSERT INTO mosquito.county (name, state_code) VALUES ($1, $2)';

function createDB() {
  //run setup.sql
  console.log('setting up DATABASE!!');
}

function insertTraps() {
  let traps = allowed_values.trap_list;
  console.log('Inserting traps...');
}

function insertSpecies() {
  let species = allowed_values.species_list;
  console.log('Inserting species...');
}

function insertStates() {
  let states = allowed_values.state_list;
  console.log('Inserting states...');
}

function insertCounties() {
  console.log('Inserting counties...');
}

// setup script //
console.log('Setting up fresh DB...');
createDB();
insertTraps();
insertSpecies();
insertStates();
insertCounties();
console.log('Fresh DB setup.');
