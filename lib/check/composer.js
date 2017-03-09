'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;

module.exports = function (config, opts) {
  config = Object.assign({src: '.'}, config || {});
  if(!fs.existsSync(config.src)) {
    throw new PluginError('gulp-composer-install', {
      message: 'Directory does not exist: ' + config.src
    });
  }

  function checkComposer(cb) {
    var execOpts = {cwd: config.src};
    exec('composer validate', execOpts, function(err, stderr, stdout) {
      if(err) {
        return cb(new PluginError('gulp-composer-validate', {
          message: err.message
        }));
      }
      cb();
    });
  }
  checkComposer._config = config;
  checkComposer._opts = opts;
  checkComposer.description = 'Check composer.json syntax.';
  checkComposer.options = {};
  return checkComposer;
};
