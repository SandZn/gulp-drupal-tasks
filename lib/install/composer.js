'use strict';

var which = require('which');
var exec = require('child_process').exec;
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'lcm-composer-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Config must be an object.');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid opts: ' + typeof opts);
  }
  // Clone config.
  config = Object.assign({ src: '.' }, config || {});

  function installComposer(done) {
    var execOpts = { cwd: config.src };
    var bin = config.bin || which.sync('composer');
    exec(bin + ' install -q', execOpts, function(err) {
      if (err) {
        return done(new PluginError(PLUGIN_NAME, {
          message: err.message
        }));
      }
      done();
    });
  }
  installComposer._config = config;
  installComposer._opts = opts;
  installComposer.displayName = 'install:composer';
  installComposer.description = 'Install Composer dependencies.';
  installComposer.options = {};
  return installComposer;
};
