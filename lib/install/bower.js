'use strict';

var which = require('npm-which')(process.cwd());
var exec = require('child_process').exec;
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'lcm-bower-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid config: ' + typeof config);
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid opts: ' + typeof opts);
  }
  // Clone config.
  config = Object.assign({ src: '.' }, config || {});

  function installBower(done) {
    var bin = config.bin || which.sync('bower');
    var execOpts = { cwd: config.src };
    exec(bin + ' install --allow-root', execOpts, function(err, stderr, stdout) {
      if (err) {
        return done(new PluginError(PLUGIN_NAME, {
          message: err.message
        }));
      }
      done();
    });
  }
  installBower._config = config;
  installBower._opts = opts;
  installBower.displayName = 'install:bower';
  installBower.description = 'Install Bower dependencies.';
  installBower.options = {};
  return installBower;
};
