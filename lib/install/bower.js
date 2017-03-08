'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;

module.exports = function (config, opts) {
  // Clone config.
  config = Object.assign({}, config || {});
  config.src = config.src && config.src.length ? config.src : '.';
  if(!fs.existsSync(config.src)) {
    throw new PluginError('gulp-composer-install', {
      message: 'Directory does not exist: ' + config.src
    });
  }

  function installBower(done) {
    var execOpts = { cwd: config.src };
    exec('bower install --allow-root', execOpts, function(err, stderr, stdout) {
      if(err) {
        return done(new PluginError('gulp-composer-install', {
          message: err.message
        }));
      }
      done();
    });
  }
  installBower._config = config;
  installBower._opts = opts;
  installBower.description = 'Install Bower dependencies.';
  installBower.options = {};
  return installBower;
};
