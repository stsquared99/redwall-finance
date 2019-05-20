'use strict';
var models = require('../../models');

var sequelize = models.sequelize;
var User = models.User;

module.exports = {
  getUsers
};

//GET /users
function getUsers(req, res) {
  User.findAll().then(
    users => res.json(users)
  ).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.name
    });

    console.error(err);
  });
}
