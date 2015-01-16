var db = require('../../db/db.js');
var User = require('../users/users.model.js');
var Rating = require('../ratings/ratings.model.js');
var Photo = require('../photos/photos.model.js');
var Comment = require('../comments/comments.model.js');
var bookshelf = require('bookshelf');

db.schema.hasTable('events').then(function (exists) {
  if (!exists) {
    db.schema.createTable('events', function (event) {
      event.increments('id').primary();
      event.integer('user_id').unsigned().references('users.id');
      event.decimal('lat', 13, 10).index();  
      event.decimal('lng', 13, 10).index();
      event.string('title', 255);
      event.bigInteger('startTime', 255).index();
      event.bigInteger('endTime', 255).index();
      event.integer('ratings');
      event.decimal('price');
      event.string('url', 255);
      event.string('info', 2000);
      event.string('category', 50);
      event.string('streetAddress1', 100);
      event.string('streetAddress2', 100);
      event.string('city', 100);
      event.string('state', 20);
      event.string('zipCode', 40);
      event.timestamps();
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
  },
  comments: function() {
    return this.hasMany(Comment);
  }
});

module.exports = Event;