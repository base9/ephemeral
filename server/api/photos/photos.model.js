var db = require('../../db/db.js');
var bookshelf = require('bookshelf');

db.schema.hasTable('photos').then(function (exists) {
  if (!exists) {
    db.schema.createTable('photos', function (photo) {
      photo.increments('id').primary();
      photo.integer('creator').unsigned().references('users.id');
      photo.integer('event').unsigned().references('events.id');
      photo.timestamps();
      photo.string('filename');
    }).then(function (){
      console.log('Created table: photos');
    });
  }
});

var Photo = bookshelf(db).Model.extend({
  tableName: 'photos',
  hasTimestamps: true,
  creator: function() {
    return this.belongsTo(User);
  },  
  event: function() {
    return this.belongsTo(Event);
  }
});

module.exports = Photo;