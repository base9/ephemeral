//DB: this is where tables/schemas are defined and created.

//DB Setup steps:
// 1. do 'npm install'
// 2. download http://postgresapp.com/ and add to applications.  Run it.
// 3. click elephant in your top bar, and click 'open psql'
// 4. in psql enter:  'CREATE DATABASE base9;''
// 5. to clear out database:
//  5a. at psql prompt, make sure you're connected to right DB with '\c base9;'
//  5b. then enter 'DROP TABLE events, photos, users, ratings;';
//  5c. make sure to end lines with a semicolon or they wont work
// 6. note that you might see errors the first time the server spins up.  restart it once or twice until errors are gone.


var knex = require('knex');
var path = require('path');
var pg = require('pg');

console.log("process.env thing is ", process.env.PG_CONNECTION_STRING);
console.log("DATABASE_URL is ", process.env.DATABASE_URL);

    var db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL || 'postgres://localhost:5432/base9'
    });

module.exports = db;
  

// pg.connect(process.env.DATABASE_URL, function(err, client) {
//   var query = client.query('SELECT * FROM your_table');

//   query.on('row', function(row) {
//     console.log(JSON.stringify(row));
//   });
// });



      // connection: {
      //   Host: 'localhost',
      //   Port: '5432',
      //   User: 'localRadar',
      //   Password: '',
      //   Database: 'localRadar',
      // }




    // var db = require('knex')({
    //   client: 'pg',
    //   connection: process.env.DATABASE_URL
    // });