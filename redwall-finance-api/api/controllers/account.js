'use strict';
var jsonmergepatch = require('json-merge-patch');

var models = require('../../models');

var sequelize = models.sequelize;
var Account = models.Account;

module.exports = {
  getAccount,
  updateAccount
};

//GET /account/{id} operationId
function getAccount(req, res, next) {
  Account.findOne({
    where: {
      accountNumber: req.swagger.params.accountNumber.value
    }
  }).then(account => {
    if (account === null) {
      throw new Error('Account not found');
    }

    res.json(account.toJSON());
  }).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.message
    });

    console.error(err);
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

    var accountProperties = req.swagger.params.account.value;

    //Should this be slient? Should it throw an error?
    accountProperties.balance = null;
    accountProperties.type = null;

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

    res.json({
      'message': err.message
    });

    console.error(err);
  });
}
