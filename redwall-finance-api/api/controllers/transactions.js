'use strict';
var models = require('../../models');

var sequelize = models.sequelize;
var Transaction = models.Transaction;

module.exports = {
  getTransactions
};

//GET /transactions
function getTransactions(req, res) {
  Transaction.findAll().then(
    transactions => res.json(transactions)
  ).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.name
    });

    console.error(err);
  });
}
