'use strict';

var SwaggerConnect = require('swagger-connect');
var app = require('connect')();
var models = require('./models');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

models.sequelize.sync().then(function() {
  SwaggerConnect.create(config, function(err, swaggerConnect) {
    if (err) { throw err; }

    // install middleware
    swaggerConnect.register(app);

    var port = process.env.PORT || 10010;
    app.listen(port);
  });
});