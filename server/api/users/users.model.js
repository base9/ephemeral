var db        = require('../../db/db.js');
var bookshelf = require('bookshelf');
var bcrypt    = require('bcrypt');
var Event     = require('../events/events.model.js');
//add photo and position

db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.timestamps();
      user.string('email', 40);
      user.string('name', 255);
      user.string('pwd', 255);
      user.string('bio', 1000);
      //user.integer('location').unsigned().references('locations.id')
      user.integer('photo_id').unsigned().references('photos.id');
    }).then(function (){
      console.log('Created table: users');
    });
  }
});

var User = bookshelf(db).Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  position: function() {
    return this.hasOne(Position);
  }, 
  event: function() {
    return this.hasMany(Event);
  },
  photo: function() {
    return this.hasOne(Photo);
  },
  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword: function(password) {
    // console.log(password, this.get('pwd'))
    // return false;
    return bcrypt.compareSync(password, this.get('pwd')); //this might throw an error in the future since idk how db works
  }
});

module.exports = User;