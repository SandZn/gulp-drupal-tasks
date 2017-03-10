'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'lcm-composer-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid config: ' + typeof config);
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid opts: ' + typeof opts);
  }
  // Clone config.
  config = Object.assign({ src: '.' }, config || {});
  if (!fs.existsSync(config.src)) {
    throw new PluginError(PLUGIN_NAME, {
      message: 'Directory does not exist: ' + config.src
    });
  }

  function installComposer(done) {
    var execOpts = { cwd: config.src };
    exec('composer install -q', execOpts, function(err, stdout, stderr) {
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
