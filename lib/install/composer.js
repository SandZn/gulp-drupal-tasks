'use strict';

var path = require('path');
var which = require('which');
var exec = require('child_process').exec;
var gutil = require('gulp-util');

var PLUGIN_NAME = 'lcm-composer-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object.');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  // Clone config.
  config = Object.assign({ src: './composer.json' }, config || {});

  if (typeof config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string');
  }

  function installComposer(done) {
    var dir = path.dirname(config.src);
    var filename = path.basename(config.src);
    var bin = config.bin || which.sync('composer');

    var execOpts = {
      cwd: dir,
      env: Object.assign({}, process.env, {COMPOSER: filename})
    };
    exec(bin + ' install -q', execOpts, function(err) {
      if (err) {
        return done(new gutil.PluginError(PLUGIN_NAME, {
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
