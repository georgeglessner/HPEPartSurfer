var express = require('express');
var app = express();

var PartsController = require('./parts');
app.use('/hpe/part', PartsController);

module.exports = app;