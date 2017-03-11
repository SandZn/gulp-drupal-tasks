'use strict';

var exec = require('child_process').exec;
var gutil = require('gulp-util');

var PLUGIN_NAME = 'lcm-check-composer-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({
    src: './composer.json',
  }, config || {});

  if (typeof config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string');
  }

  function checkComposer(cb) {
    exec('composer validate ' + config.src, {}, function(err) {
      if (err) {
        return cb(new gutil.PluginError(PLUGIN_NAME, {
          message: err.message
        }));
      }
      cb();
    });
  }
  checkComposer._config = config;
  checkComposer._opts = opts;
  checkComposer.displayName = 'check:composer';
  checkComposer.description = 'Check composer.json syntax.';
  checkComposer.options = {};
  return checkComposer;
};
