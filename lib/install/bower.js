'use strict';

var which = require('npm-which')(process.cwd());
var exec = require('child_process').exec;
var gutil = require('gulp-util');

var PLUGIN_NAME = 'lcm-bower-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  // Clone config.
  config = Object.assign({ src: '.' }, config || {});

  function installBower(done) {
    var bin = config.bin || which.sync('bower');
    var execOpts = { cwd: config.src };
    exec(bin + ' install --allow-root', execOpts, function(err) {
      if (err) {
        err = new gutil.PluginError(PLUGIN_NAME, {
          message: err.message
        });
      }
      done(err);
    });
  }
  installBower._config = config;
  installBower._opts = opts;
  installBower.displayName = 'install:bower';
  installBower.description = 'Install Bower dependencies.';
  installBower.options = {};
  return installBower;
};
