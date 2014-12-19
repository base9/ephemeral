var db = require('../../db/db.js');
var User = require('../../db/models.js').User;

var Event = db.Model.extend({
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