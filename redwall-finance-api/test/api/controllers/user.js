var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('user', function() {

    describe('POST /user', function() {

      it('should successfully add a user', function(done) {

        request(server)
          .post('/user')
          .send({
            firstName: "Joe",
            lastName: "Bloggs",
            email: "joe.bloggs@example.com"
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.eql('Hello, stranger!');

            done();
          });
      });

    });

  });

});
