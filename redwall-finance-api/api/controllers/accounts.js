'use strict';
var models = require('../../models');

var sequelize = models.sequelize;
var Account = models.Account;

module.exports = {
  get
};

//GET /accounts
function get(req, res) {
  sequelize.sync().then(
    () => Account.findAll()
  ).then(
    accounts => res.json(accounts)
  ).catch(function(err) {
    res.status(400);

    res.json({
      'message': err.name
    });

    console.error(err);
  });
}
