//DB: this is where tables/schemas are defined and created.

var knex = require('knex');
var path = require('path');
var pg = require('pg');

// pg.connect(process.env.DATABASE_URL, function(err, client) {
//   var query = client.query('SELECT * FROM your_table');

//   query.on('row', function(row) {
//     console.log(JSON.stringify(row));
//   });
// });

console.log("process.env thing is ", process.env.PG_CONNECTION_STRING);
console.log("DATABASE_URL is ", process.env.DATABASE_URL);

    // var db = require('knex')({
    //   client: 'pg',
    //   connection: process.env.DATABASE_URL
    // });

    var db = knex({
      client: 'pg',
      connection: process.env.PG_CONNECTION_STRING || 'postgres://localhost:5432'
      // connection: {
      //   Host: 'localhost',
      //   Port: '5432',
      //   User: 'localRadar',
      //   Password: '',
      //   Database: 'localRadar',
      // }
    });



module.exports = db;
  

