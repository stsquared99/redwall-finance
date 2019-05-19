'use strict';
var util = require('util');
var models = require('../../models');

var sequelize = models.sequelize;
var User = models.User;

module.exports = {
  add
};

//POST /user
function add(req, res) {
  sequelize.sync().then(
    () => User.create(req.swagger.params.user.value)
  ).then(
    user => res.json(user.toJSON())
  ).catch(function(err) {
    res.status(400);

    if (err.name === 'SequelizeUniqueConstraintError') {
      res.json({
        'message': 'Duplicate email'
      });
    } else {
      res.json({
        'message': err.name
      });

      console.error(err);
    }
  });
}
