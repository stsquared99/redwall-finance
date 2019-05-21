'use strict';
var models = require('../../models');

var sequelize = models.sequelize;
var Account = models.Account;

module.exports = {
  getAccounts
};

//GET /accounts
function getAccounts(req, res) {
  Account.findAll().then(
    accounts => res.json(accounts)
  ).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.message
    });

    console.error(err);
  });
}
