var db = require('../../db/db.js');
var User = require('../user/user.model.js');  //this path is temporary
var bookshelf = require('bookshelf');

db.schema.hasTable('events').then(function (exists) {
  if (!exists) {
    db.schema.createTable('events', function (evnt) {
      evnt.increments('id').primary();
      evnt.integer('user_id').unsigned().references('users.id');
      evnt.timestamps();
      evnt.string('lat', 40);  
      evnt.string('lng', 40);
      evnt.string('title', 255);
      evnt.timestamp('startTime', 255);
      evnt.timestamp('endTime', 255);
      evnt.timestamp('revealTime', 255);
      evnt.string('info', 1000);
      evnt.integer('photo_id').unsigned().references('photos.id');
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
    return this.hasOne(Position)
  },
  rating: function() {
    return this.hasMany(Rating)
  }
});

module.exports = Event;