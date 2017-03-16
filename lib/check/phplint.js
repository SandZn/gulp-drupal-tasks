'use strict';

var gutil = require('gulp-util');
// We use some lazy requires here for loading performance.
// See the task function for more info.

var PLUGIN_NAME = 'lcm-check-phplint-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({ src: [], bin: '' }, config);

  function checkPhpLint(cb) {
    var phplint = require('phplint').lint;

    return phplint(config.src, { phpCmd: config.bin }, function(err) {
      cb(err);
    });
  }
  checkPhpLint._config = config;
  checkPhpLint._opts = opts;
  checkPhpLint.displayName = 'check:phplint';
  checkPhpLint.description = 'Check PHPLint.';
  checkPhpLint.options = {};

  return checkPhpLint;
};
