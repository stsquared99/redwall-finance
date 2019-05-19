'use strict';
var util = require('util');
var models = require('../../models');

var sequelize = models.sequelize;
var User = models.User;

module.exports = {
  add,
  remove,
  update
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

//DELETE /user/{id} operationId
function remove(req, res, next) {
  sequelize.sync().then(
    () => User.destroy({
      where: {userId: req.swagger.params.userId.value}
    })
  ).then(function(data) {
    res.status(204);

    res.json();
  }).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.name
    });

    console.error(err);
  });
}

//PUT /user/{id} operationId
function update(req, res, next) {
  sequelize.sync().then(
    () => User.update(
      req.swagger.params.user.value,{
        returning: true,
        where: {userId: req.swagger.params.userId.value}
      }
    )
  ).then(function(data) {
    if (data[0] === 0) {
      res.status(400);

      res.json({
        'message': 'User not found'
      });
    }
    else {
      res.json(data[1][0])
    }
  }).catch(function(err) {
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