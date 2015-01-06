var db = require('../../db/db.js');
var User = require('../users/users.model.js');
var Rating = require('../ratings/ratings.model.js');
var bookshelf = require('bookshelf');

db.schema.hasTable('events').then(function (exists) {
  if (!exists) {
    db.schema.createTable('events', function (evnt) {
      evnt.increments('id').primary();
      evnt.integer('user_id').unsigned().references('users.id');
      evnt.string('lat', 40);  
      evnt.string('lng', 40);
      evnt.string('title', 255);
      evnt.timestamp('startTime', 255);
      evnt.timestamp('endTime', 255);
      evnt.timestamp('revealTime', 255);
      evnt.string('info', 2000);
      evnt.string('category', 50);
      evnt.string('streetAddress1', 100);
      evnt.string('streetAddress2', 100);
      evnt.string('city', 100);
      evnt.string('state', 20);
      evnt.string('zipCode', 40);
      evnt.integer('photo_id').unsigned().references('photos.id');
      evnt.timestamps();
    }).then(function (){
      console.log('Created table: events');
    });
  }
});

var Event = bookshelf(db).Model.extend({
  tableName: 'events',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }, 
  location: function() {
    return this.hasOne(Position);
  },
  rating: function() {
    return this.hasMany(Rating);
  }
});

module.exports = Event;