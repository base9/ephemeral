var should = require('should');
var expect = require("chai").expect;
var request = require('request');
 
describe("Server", function(){
  
  describe("Endpoints", function(){
  it("should have a responsive GET api/events/  ", function(done) {
      request.get('https://aqueous-beyond-6514.herokuapp.com/api/events', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      })
  });

  it("should have a responsive GET api/events/:id  ", function(done) {
    // Checks events id:1, will not work if database is completely empty or if event id: 1 has been cleared
      request.get('https://aqueous-beyond-6514.herokuapp.com/api/events/1', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      })
  });

  it("should have a responsive POST api/events/  ", function(done) {
    // Checks events id:1, will not work if database is completely empty or if event id: 1 has been cleared
      request
        .post('https://aqueous-beyond-6514.herokuapp.com/api/events/')
        .form({
          lat: 37.884541,  
          lng: -122.304272,
          title: "Evan's Awesome Party!",
          info: "Is Rockin' like 1995"
        })
        .on('response', function (res) {
          expect(res.statusCode).to.equal(201);
          done();
        });
  });

  });

});