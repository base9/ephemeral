//DB: this is where tables/schemas are defined and created.

var knex = require('knex');
var path = require('path');

console.log("process.env thing is ", process.env.PG_CONNECTION_STRING);

// if(process.env.PG_CONNECTION_STRING){
    var db = require('knex')({
      client: 'mysql',
      connection: 'mysql://beff67717752e6:21eda754@us-cdbr-iron-east-01.cleardb.net/heroku_fd9c5647c2bda50?reconnect=true'
    });

  // } else {
  //   var db = knex({
  //     client: 'sqlite3',
  //     connection: {
  //       host: '127.0.0.1',
  //       user: 'dbUser',
  //       password: 'dbPassword',
  //       database: 'nowHereThisDb',
  //       charset: 'utf8',
  //       filename: path.join(__dirname, './db.sqlite')
  //     }
  //   });
    
  // }


module.exports = db;
  

// CLEARDB_DATABASE_URL: mysql://bd71b4c32bf6eb:85266154@us-cdbr-iron-east-01.cleardb.net/heroku_804c45c486a427b?reconnect=true