//DB: this is where tables/schemas are defined and created.

var knex = require('knex');
var path = require('path');


var db = knex({
  client: 'sqlite3',
  connection: {
    host: '127.0.0.1',
    user: 'dbUser',
    password: 'dbPassword',
    database: 'nowHereThisDb',
    charset: 'utf8',
    filename: path.join(__dirname, './db.sqlite')
  }
});



module.exports = db;
  
