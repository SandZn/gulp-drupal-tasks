'use strict';

var configAdapter = require('./lib/config');
var builder = require('./lib');

module.exports = function(gulp, inputConfig, opts) {
  var config = configAdapter(inputConfig);
  builder(gulp, config, opts);
};
