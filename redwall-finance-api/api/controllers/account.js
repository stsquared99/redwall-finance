'use strict';
var models = require('../../models');

var sequelize = models.sequelize;
var Account = models.Account;

module.exports = {
  add,
  remove,
  update
};

//POST /account
function add(req, res) {
  sequelize.sync().then(
    () => Account.create(req.swagger.params.account.value)
  ).then(
    account => res.json(account.toJSON())
  ).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.name
    });

    console.error(err);
  });
}

//PUT /account/{id} operationId
function update(req, res, next) {
  sequelize.sync().then(
    () => Account.update(
      req.swagger.params.account.value, {
        returning: true,
        where: {
          accountId: req.swagger.params.accountId.value
        }
      }
    )
  ).then(function(data) {
    if (data[0] === 0) {
      res.status(400);

      res.json({
        'message': 'Account not found'
      });
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
        'message': err.name
      });

      console.error(err);
    }
  });
}
