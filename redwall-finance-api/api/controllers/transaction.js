'use strict';
var models = require('../../models');

var sequelize = models.sequelize;
var Transaction = models.Transaction;

module.exports = {
  getTransaction
};

//GET /transaction/{id} operationId
function getTransaction(req, res, next) {
  Transaction.findOne({
    where: {
      transactionId: req.swagger.params.transactionId.value
    }
  }).then(transaction => {
    if (transaction === null) {
      throw new Error('Transaction not found');
    }

    res.json(transaction.toJSON());
  }).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.message
    });

    console.error(err);
  });
}
