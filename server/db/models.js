// MODELS: this provides an api for the server to talk to the database

var db = require('./db.js');
var bookshelf = require('bookshelf');

db = bookshelf(db);

var Position = db.Model.extend({
  tableName: 'positions',
  hasTimestamps: true,
});

var Rating = db.Model.extend({
  tableName: 'ratings',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  } , 
  event: function() {
    return this.belongsTo(Event);
  }
});

// var Event = db.Model.extend({
//   tableName: 'events',
//   hasTimestamps: true,
//   user: function() {
//     console.log("models.js line 26");
//     return this.belongsTo(User);
//   }, 
//   location: function() {
//     return this.hasOne(Position)
//   },
//   rating: function() {
//     return this.hasMany(Rating)
//   }
// });

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   position: function() {
//     return this.hasOne(Position)
//   }, 
//   event: function() {
//     return this.hasMany(Event);
//   },
//   photo: function() {
//     return this.hasOne(Photo);
//   }
// });

var Photo = db.Model.extend({
  tableName: 'photos',
  hasTimestamps: true,
  creator: function() {
    return this.belongsTo(User);
  },  
  event: function() {
    return this.belongsTo(Event);
  }
});


module.exports = {
  Position: Position, 
  // User: User,
  // Event: Event,
  Photo: Photo,
  Rating: Rating,
};


