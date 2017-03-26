'use strict';

var gulp = require('gulp');
var path = require('path');
var which = require('which');
var through = require('through2');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');

var PLUGIN_NAME = 'lcm-composer-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  // Clone config.
  var _config = Object.assign({ src: './composer.json', bin: null }, config || {});
  var _opts = Object.assign({ silent: false }, opts || {});

  if (typeof _config.src !== 'string' && !Array.isArray(_config.src)) {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a gulp glob');
  }
  if (_config.bin && typeof _config.bin !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'bin must be a string');
  }

  function installComposer() {
    return gulp.src(_config.src)
      .pipe(composer({
        silent: _opts.silent,
        bin: _config.bin,
      }));
  }
  installComposer._config = _config;
  installComposer._opts = _opts;
  installComposer.displayName = 'install:composer';
  installComposer.description = 'Install Composer dependencies.';
  installComposer.options = {};
  return installComposer;
};

function composer(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var execOpts = {
      env: Object.assign({}, process.env),
      stdio: opts.silent ? 'ignore' : 'inherit'
    };
    if (file.isDirectory()) {
      execOpts.cwd = file.path;
    }    else {
      execOpts.cwd = path.dirname(file.path);
      execOpts.env.COMPOSER =  path.basename(file.path);
    }
    var bin = opts.bin || which.sync('composer');
    var child = spawn(bin, ['install'], execOpts, {
      stdio: opts.silent ? 'ignore' : 'inherit'
    });
    child.on('error', function(err) {
      child.childErr = err;
    });
    child.on('close', function(code) {
      if (child.childErr) {
        return cb(child.childErr);
      }
      if (code !== 0) {
        return cb(new Error('Exited with code ' + code));
      }
      cb(null, file);
    });
  });
}
