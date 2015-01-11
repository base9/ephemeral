var db = require('../../db/db.js');
var User = require('../users/users.model.js');
var Rating = require('../ratings/ratings.model.js');
var Photo = require('../photos/photos.model.js');
var bookshelf = require('bookshelf');

db.schema.hasTable('events').then(function (exists) {
  if (!exists) {
    db.schema.createTable('events', function (evnt) {
      evnt.increments('id').primary();
      evnt.integer('user_id').unsigned().references('users.id');
      evnt.decimal('lat', 40).index();  
      evnt.decimal('lng', 40).index();
      evnt.string('title', 255);
      evnt.bigInteger('startTime', 255).index();
      evnt.bigInteger('endTime', 255).index();
      evnt.decimal('price');
      // evnt.timestamp('revealTime', 255);
      evnt.string('url', 255);
      evnt.string('info', 2000);
      evnt.string('category', 50);
      evnt.string('streetAddress1', 100);
      evnt.string('streetAddress2', 100);
      evnt.string('city', 100);
      evnt.string('state', 20);
      evnt.string('zipCode', 40);
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
  photos: function() {
    return this.hasMany(Photo);
  },
  rating: function() {
    return this.hasMany(Rating);
  }
});

module.exports = Event;