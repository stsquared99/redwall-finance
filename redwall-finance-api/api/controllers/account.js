'use strict';
var jsonmergepatch = require('json-merge-patch');
var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var models = require('../../models');

var sequelize = models.sequelize;
var Account = models.Account;
var Transaction = models.Transaction;

module.exports = {
  doATMTransaction,
  doDebitTransaction,
  doExternalTransfer,
  doInternalTransfer,
  getAccount,
  getAccountTransactions,
  updateAccount
};

//POST /account/{accountNumber}/atm
function doATMTransaction(req, res) {
  Account.findOne({
    where: {
      accountNumber: req.swagger.params.accountNumber.value
    }
  }).then(account => {
    if (account === null) {
      throw new Error('Account not found');
    }

    var accountJson = account.toJSON();
    var amountInCents = req.swagger.params.transactionProperties.value.amountInCents;
    var type = req.swagger.params.transactionProperties.value.type;

    var createTransactionProperties;

    if (type === 'DEPOSIT') {
      accountJson.balanceInCents += amountInCents;

      createTransactionProperties = {
        amountInCents: amountInCents,
        description: 'ATM ' + type,
        fromAccountType: 'ATM',
        fromAccountNumber: 0,
        fromRoutingNumber: 0,
        toAccountType: 'INTERNAL',
        toAccountNumber: accountJson.accountNumber,
        toRoutingNumber: accountJson.routingNumber
      };
    } else {
      accountJson.balanceInCents -= amountInCents;

      createTransactionProperties = {
        amountInCents: amountInCents,
        description: 'ATM ' + type,
        fromAccountType: 'INTERNAL',
        fromAccountNumber: accountJson.accountNumber,
        fromRoutingNumber: accountJson.routingNumber,
        toAccountType: 'ATM',
        toAccountNumber: 0,
        toRoutingNumber: 0
      };
    }

    return sequelize.transaction(t => {
      return Account.update(accountJson, {
        where: {
          accountNumber: req.swagger.params.accountNumber.value
        }
      }).then(() => {
        return Transaction.create(createTransactionProperties);
      });
    });
  }).then(
    transaction => {
      res.json(transaction.toJSON());
    }
  ).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.message
    });

    console.error(err);
  });
}

//POST /account/{accountNumber}/debit
function doDebitTransaction(req, res) {
  Account.findOne({
    where: {
      accountNumber: req.swagger.params.accountNumber.value
    }
  }).then(account => {
    if (account === null) {
      throw new Error('Account not found');
    }

    var accountJson = account.toJSON();
    var amountInCents = req.swagger.params.transactionProperties.value.amountInCents;
    var type = req.swagger.params.transactionProperties.value.type;

    var createTransactionProperties;

    if (type === 'CHARGE') {
      accountJson.balanceInCents -= amountInCents;

      createTransactionProperties = {
        amountInCents: amountInCents,
        description: 'DEBIT ' + type,
        fromAccountType: 'INTERNAL',
        fromAccountNumber: accountJson.accountNumber,
        fromRoutingNumber: accountJson.routingNumber,
        toAccountType: 'DEBIT',
        toAccountNumber: 0,
        toRoutingNumber: 0
      };
    } else {
      accountJson.balanceInCents += amountInCents;

      createTransactionProperties = {
        amountInCents: amountInCents,
        description: 'DEBIT ' + type,
        fromAccountType: 'DEBIT',
        fromAccountNumber: 0,
        fromRoutingNumber: 0,
        toAccountType: 'INTERNAL',
        toAccountNumber: accountJson.accountNumber,
        toRoutingNumber: accountJson.routingNumber
      };
    }

    return sequelize.transaction(t => {
      return Account.update(accountJson, {
        where: {
          accountNumber: req.swagger.params.accountNumber.value
        }
      }).then(() => {
        return Transaction.create(createTransactionProperties);
      });
    });
  }).then(
    transaction => {
      res.json(transaction.toJSON());
    }
  ).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.message
    });

    console.error(err);
  });
}

//POST /account/{accountNumber}/transfer
function doExternalTransfer(req, res) {}

//POST /account/{fromAccountNumber}/transfer/{toAccountNumber}
function doInternalTransfer(req, res) {}

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

//GET /account/{accountNumber}/transactions:
function getAccountTransactions(req, res) {
  Account.findOne({
    where: {
      accountNumber: req.swagger.params.accountNumber.value
    }
  }).then(user => {
    if (user === null) {
      throw new Error('Account not found');
    }

    return Transaction.findAll({
      where: {
        [Op.or]: [{
            fromAccountNumber: req.swagger.params.accountNumber.value
          },
          {
            toAccountNumber: req.swagger.params.accountNumber.value
          }
        ]
      }
    });
  }).then(
    accounts => res.json(accounts)
  ).catch(function(err) {
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

    var accountProperties = req.swagger.params.accountProperties.value;

    //Should this be slient? Should it throw an error?
    accountProperties.balanceInCents = null;
    accountProperties.type = null;

    account = jsonmergepatch.apply(
      account, req.swagger.params.accountProperties.value);

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
