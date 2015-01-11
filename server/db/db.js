var knex = require('knex');
var path = require('path');
var pg = require('pg');

  var db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/base9'
  });

module.exports = db;
