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

  function installComposer(done) {
    var execOpts = {cwd: config.src};
    exec('composer install -q', execOpts, function(err, stdout, stderr) {
      if(err) {
        return done(new PluginError('gulp-composer-install', {
          message: err.message
        }));
      }
      done();
    });
  }
  installComposer._config = config;
  installComposer._opts = opts;
  installComposer.description = 'Install Composer dependencies.';
  installComposer.options = {};
  return installComposer;
};
