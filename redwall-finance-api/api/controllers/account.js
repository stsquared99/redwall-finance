'use strict';
var jsonmergepatch = require('json-merge-patch');

var models = require('../../models');

var sequelize = models.sequelize;
var Account = models.Account;

module.exports = {
  addAccount,
  removeAccount,
  updateAccount
};

//DELETE /account/{id} operationId
function removeAccount(req, res, next) {
  Account.destroy({
    where: {
      accountNumber: req.swagger.params.accountNumber.value
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

//POST /account
function addAccount(req, res) {
  Account.create(req.swagger.params.account.value).then(
    account => res.json(account.toJSON())
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

//PATCH /account/{id} operationId
function updateAccount(req, res, next) {
  Account.findOne({
    where: {
      accountNumber: req.swagger.params.accountNumber.value
    }
  }).then(account => {
    if (account === null) {
      throw new Error('Account not found');
    }

    account = jsonmergepatch.apply(account, req.swagger.params.account.value);

    return Account.update(account.toJSON(), {
      returning: true,
      where: {
        accountNumber: req.swagger.params.accountNumber.value
      }
    });
  }).then(function(data) {
    if (data[0] === 0) {
      throw new Error('Account not found');
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
