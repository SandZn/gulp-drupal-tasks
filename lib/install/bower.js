'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;

const PLUGIN_NAME = 'lcm-bower-install-task';

module.exports = function (config, opts) {
  // Clone config.
  config = Object.assign({src: '.'}, config || {});
  if(!fs.existsSync(config.src)) {
    throw new PluginError('gulp-composer-install', {
      message: 'Directory does not exist: ' + config.src
    });
  }

  function installBower(done) {
    var execOpts = { cwd: config.src };
    exec('bower install --allow-root', execOpts, function(err, stderr, stdout) {
      if(err) {
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
