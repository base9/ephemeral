// MODELS: this provides an api for the server to talk to the database

var db = require('./db.js');


var Position = db.Model.extend({
  tableName: 'positions',
  hasTimestamps: true,
});

var Rating = db.Model.extend({
  tableName: 'ratings',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User, 'userId');
  } , 
  event: function() {
    return this.belongsTo(Event, 'eventId');
  }
});

var Event = db.Model.extend({
  tableName: 'events',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User, 'userId');
  }, 
  location: function() {
    return this.hasOne(Position, 'positionId')
  },
  rating: function() {
    return this.hasMany(Rating, 'ratingId')
  }
});

var User = db.Model.extend({
  tableName: 'ratings',
  hasTimestamps: true,
  position: function() {
    return this.hasOne(Position, 'positionId')
  }, 
  event: function() {
    return this.hasMany(Event, 'eventId');
  },
  photo: function() {
    return this.hasOne(Photo, 'photoId');
  }
});

var Photo = db.Model.extend({
  tableName: 'photos',
  hasTimestamps: true,
  creator: function() {
    return this.belongsTo(User, 'userId');
  },  
  event: function() {
    return this.belongsTo(Event, 'eventId');
  }
});


module.exports = {
  Position: Position, 
  User: User,
  Event: Event,
  Photo: Photo,
  Rating: Rating,
};


