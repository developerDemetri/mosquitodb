'use strict';

let fs = require('fs');

const queries = {
  'get_states': 'SELECT code, name FROM mosquito.state ORDER BY name ASC',
  'get_counties': 'SELECT id, name FROM mosquito.county WHERE state_code=$1 ORDER BY name ASC',
  'get_species': 'SELECT id, name FROM mosquito.species ORDER BY name ASC',
  'get_traps': 'SELECT id, name FROM mosquito.trap ORDER BY name ASC',
  'insert_collection': 'INSERT INTO mosquito.collection(year, month, week, state_code, county_id, trap_id, species_id, pools, individuals, trap_nights, wnv_results, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
  'trap_insert_query': 'INSERT INTO mosquito.trap (name, comment) VALUES ($1, $2)',
  'species_insert_query': 'INSERT INTO mosquito.species (name) VALUES ($1)',
  'state_insert_query': 'INSERT INTO mosquito.state (code, name) VALUES ($1,$2)',
  'create_query': fs.readFileSync('bin/create_schema.sql').toString().trim(),
  'county_insert_query': 'INSERT INTO mosquito.county (name, state_code) VALUES ($1, $2)'
};

module.exports = queries;
