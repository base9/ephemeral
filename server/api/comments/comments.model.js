var db = require('../../db/db.js');
var User = require('../users/users.model.js');
var Event = require('../events/events.model.js');
var bookshelf = require('bookshelf');

db.schema.hasTable('comments').then(function (exists) {
  if (!exists) {
    db.schema.createTable('comments', function (comment) {
      comment.increments('id').primary();
      comment.integer('user_id').unsigned().references('users.id');
      comment.integer('event_id').unsigned().references('events.id');
      comment.string('comment',1000);
      comment.timestamps();
    }).then(function (){
      console.log('Created table: comments');
    });
  }
});

var Comment = bookshelf(db).Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }, 
  event: function() {
    return this.belongsTo(Event);
  }
});

module.exports = Comment;