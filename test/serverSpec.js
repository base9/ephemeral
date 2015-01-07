var should = require('should');
var expect = require('chai').expect;
var request = require('supertest');

// run the app for testing and import access
var app = require('./../server').app;
 
describe('Server Endpoints', function(){
  request = request('http://localhost:9000');
  var events = '/api/events';
  describe('Event API', function(){
    it('GET "api/events/" should send non empty response', function(done) {
      request.get(events)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('GET api/events/:id should send the event with requested id', function(done) {
      request.get(events + '/1')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          var event = res.body;
          expect(event.id).to.equal(1);
          expect(event.title).to.equal('SantaCon');
          done();
        })
    });

    it('should redirect POST "api/events/" to "/" if not logged in', function(done) {
      request.post(events)
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
          done();
        })
    });


    var ratings = '/api/ratings';

    it('should add new ratings', function(done) {
      request.post(ratings)
        .set('Accept', 'application/json')
        .send({user_id: 1, event_id: 1})
        .expect(201)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        })
    });

    var comments = '/api/comments';

    it('should add new comments', function(done) {
      request.post(comments)
        .set('Accept', 'application/json')
        .send({user_id: 1, event_id: 1, comment:'test comment'})
        .expect(201)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        })
    });


  });
});

// Static server
  // index html
  // css, js and bower lib files

// Auth 
  // signup should create new user
  // signup errors are raised at the right moments
  // login should be able to login with correct credentials
  // login should not login with wrong credentials
  // logout should log out
  // protected api should not be accessible without sending session token

// API/photo

  // /addOne should return a signed URL and create a new record

  //destroyOne should respond with the right status code.  
  //should do something different if auth check fails.

