'use strict';
var jsonmergepatch = require('json-merge-patch');

var models = require('../../models');

var sequelize = models.sequelize;
var User = models.User;

module.exports = {
  addUser,
  getUser,
  removeUser,
  updateUser
};

//POST /user
function addUser(req, res) {
  User.create(req.swagger.params.user.value).then(
    user => res.json(user.toJSON())
  ).catch(function(err) {
    res.status(400);

    if (err.name === 'SequelizeUniqueConstraintError') {
      res.json({
        'message': 'Duplicate email'
      });
    } else {
      res.json({
        'message': err.message
      });

      console.error(err);
    }
  });
}

//GET /user/{id} operationId
function getUser(req, res, next) {
  User.findOne({
    where: {
      userId: req.swagger.params.userId.value
    }
  }).then(user => {
    if (user === null) {
      throw new Error('User not found');
    }

    res.json(user.toJSON());
  }).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.message
    });

    console.error(err);
  });
}

//DELETE /user/{id} operationId
function removeUser(req, res, next) {
  User.destroy({
    where: {
      userId: req.swagger.params.userId.value
    }
  }).then(function(data) {
    res.status(204);

    res.json();
  }).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.message
    });

    console.error(err);
  });
}

//PATCH /user/{id} operationId
function updateUser(req, res, next) {
  User.findOne({
    where: {
      userId: req.swagger.params.userId.value
    }
  }).then(user => {
    if (user === null) {
      throw new Error('User not found');
    }

    user = jsonmergepatch.apply(user, req.swagger.params.user.value);

    return User.update(user.toJSON(), {
      returning: true,
      where: {
        userId: req.swagger.params.userId.value
      }
    });
  }).then(function(data) {
    if (data[0] === 0) {
      throw new Error('User not found');
    } else {
      res.json(data[1][0]);
    }
  }).catch(function(err) {
    res.status(400);

    if (err.name === 'SequelizeUniqueConstraintError') {
      res.json({
        'message': 'Duplicate email'
      });
    } else {
      res.json({
        'message': err.message
      });

      console.error(err);
    }
  });
}