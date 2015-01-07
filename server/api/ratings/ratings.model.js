var db = require('../../db/db.js');
var User = require('../users/users.model.js');
var Event = require('../events/events.model.js');
var bookshelf = require('bookshelf');

db.schema.hasTable('ratings').then(function (exists) {
  if (!exists) {
    db.schema.createTable('ratings', function (rating) {
      rating.increments('id').primary();
      rating.integer('user_id').unsigned().references('users.id');
      rating.integer('event_id').unsigned().references('events.id');
      rating.timestamps();
    }).then(function (){
      console.log('Created table: ratings');
    });
  }
});

var Rating = bookshelf(db).Model.extend({
  tableName: 'ratings',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }, 
  event: function() {
    return this.belongsTo(Event);
  }
});

module.exports = Rating;