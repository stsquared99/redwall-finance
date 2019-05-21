'use strict';
var chai = require('chai');
var sequelizeFixtures = require('sequelize-fixtures');
var ZSchema = require('z-schema');
var customFormats = module.exports = function(zSchema) {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', function(val) {
    return !decimalPattern.test(val.toString());
  });

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', function(val) {
    // the 32bit shift (>>) truncates any bits beyond max of 32
    return Number.isInteger(val) && ((val >> 0) === val);
  });

  zSchema.registerFormat('int64', function(val) {
    return Number.isInteger(val);
  });

  zSchema.registerFormat('float', function(val) {
    // better parsing for custom "float" format
    if (Number.parseFloat(val)) {
      return true;
    } else {
      return false;
    }
  });

  zSchema.registerFormat('date', function(val) {
    // should parse a a date
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('dateTime', function(val) {
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('password', function(val) {
    // should parse as a string
    return typeof val === 'string';
  });
};

customFormats(ZSchema);

var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;
var expect = chai.expect;

var models = require('../../../models');

var sequelize = models.sequelize;
var User = models.User;

describe('/user', function() {
  describe('post', function() {
    beforeEach(
      done => sequelize.query(
        'DELETE FROM "Transactions" WHERE "transactionId" > 0; ' +
        'DELETE FROM "Accounts" WHERE "accountNumber" > 0; ' +
        'DELETE FROM "Users" WHERE "userId" > 0; '
      ).asCallback(done));

    it('should respond with 200 Success', function(done) {
      /*eslint-disable*/
      var schema = {
        'required': [
          'userId',
          'firstName',
          'lastName',
          'email',
          'createdAt',
          'updatedAt'
        ],
        'properties': {
          'userId': {
            'type': 'integer'
          },
          'firstName': {
            'type': 'string'
          },
          'lastName': {
            'type': 'string'
          },
          'email': {
            'type': 'string'
          },
          'createdAt': {
            'type': 'string'
          },
          'updatedAt': {
            'type': 'string'
          }
        }
      };

      /*eslint-enable*/
      api.post('/user')
        .set('Content-Type', 'application/json')
        .send({
          firstName: 'Joe',
          lastName: 'Bloggs',
          email: 'joe.bloggs@example.com'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(validator.validate(res.body, schema)).to.be.true;
          done();
        });
    });

    it('with duplicate email should respond with 400 Error', function(done) {
      /*eslint-disable*/
      var schema = {
        'required': [
          'message'
        ],
        'properties': {
          'message': {
            'type': 'string'
          }
        }
      };

      sequelizeFixtures.loadFile(
        './test/fixtures/single_user.yaml', models, {log: function() {}}
      ).then(() => {

        api.post('/user')
          .set('Content-Type', 'application/json')
          .send({
            firstName: 'Test',
            lastName: 'Test',
            email: 'joe.bloggs@example.com'
          })
          .expect(400)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            expect(validator.validate(res.body, schema)).to.be.true;
            done();
          });
      }).catch(function(err) {
        done(err);
      });
    });

  });

});
