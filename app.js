var express = require('express');
var app = express();

var UserController = require('./parts');
app.use('/hpe/part', UserController);

module.exports = app;