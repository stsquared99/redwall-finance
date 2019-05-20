'use strict';

var SwaggerConnect = require('swagger-connect');
var app = require('connect')();
var models = require('./models');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerConnect.create(config, function(err, swaggerConnect) {
  if (err) { throw err; }

  // install middleware
  swaggerConnect.register(app);

  var port = process.env.PORT || 10010;

  models.sequelize.sync().then(function() {
    app.listen(port);

    console.log('listening on http://127.0.0.1:' + port);
  });
});