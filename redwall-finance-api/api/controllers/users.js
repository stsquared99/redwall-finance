'use strict';
var util = require('util');
var models = require('../../models');

var sequelize = models.sequelize
var User = models.User;

module.exports = {get};

//GET /users
function get(req, res) {
  sequelize.sync().then(
    () => User.findAll()
  ).then(
    users => res.json(users)
  ).catch(function(err) {
    res.json({"message":err.name});
    res.status(400);

    console.error(err);
  });
}
