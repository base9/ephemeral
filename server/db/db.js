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

db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.timestamps();
      user.string('email', 40);
      user.string('name', 255);
      user.string('pwd', 255);
      user.string('bio', 1000);
      user.integer('location').unsigned().references('locations.id')
      user.integer('profilePhotoId').unsigned().references('photos.id');
    }).then(function (){
      console.log('Created table: users');
    });
  }
});

db.schema.hasTable('pins').then(function (exists) {
  if (!exists) {
    db.schema.createTable('pins', function (pin) {
      pin.increments('id').primary();
      pin.integer('creator').unsigned().references('users.id');
      pin.timestamps();
      pin.integer('location').unsigned().references('locations.id')
      pin.string('title', 255);
      pin.timestamp('startTime', 255);
      pin.timestamp('endTime', 255);
      pin.timestamp('revealTime', 255);
      pin.timestamp('hideTime', 255);
      pin.string('info', 1000);
      pin.integer('photoId').unsigned().references('photos.id');
    }).then(function (){
      console.log('Created table: pins');
    });
  }
});


db.schema.hasTable('ratings').then(function (exists) {
  if (!exists) {
    db.schema.createTable('ratings', function (rating) {
      rating.increments('id').primary();
      rating.integer('creator').unsigned().references('users.id');
      rating.integer('pin').unsigned().references('pins.id');
      rating.timestamps();
      rating.integer('score');
      pin.string('comment', 1000);
    }).then(function (){
      console.log('Created table: ratings');
    });
  }
});


db.schema.hasTable('photos').then(function (exists) {
  if (!exists) {
    db.schema.createTable('photos', function (photo) {
      photo.increments('id').primary();
      photo.integer('creator').unsigned().references('users.id');
      photo.integer('pin').unsigned().references('pins.id');
      photo.timestamps();
      photo.string('filename');
    }).then(function (){
      console.log('Created table: photos');
    });
  }
});

//for location
db.schema.hasTable('locations').then(function (exists) {
  if (!exists) {
    db.schema.createTable('locations', function (location) {
      location.increments('id').primary();
      location.string('lat',40);
      location.integer('lng',40);
      location.timestamps();
    }).then(function (){
      console.log('Created table: locations');
    });
  }
});

/*
table ratings:
  created_by: (foreign key to users);
  pin_id: (foreign key to pin);
  created_at:
  text:

table photos:



  
