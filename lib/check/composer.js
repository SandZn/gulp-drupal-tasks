'use strict';

var exec = require('child_process').exec;
var gutil = require('gulp-util');

var PLUGIN_NAME = 'lcm-check-composer-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Invalid config: ' + typeof config);
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Invalid opts: ' + typeof opts);
  }
  config = Object.assign({ src: '.' }, config || {});

  function checkComposer(cb) {
    var execOpts = { cwd: config.src };
    exec('composer validate', execOpts, function(err) {
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
