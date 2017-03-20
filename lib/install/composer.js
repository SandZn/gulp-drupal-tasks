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
  config = Object.assign({ src: './composer.json', bin: null }, config || {});
  opts = Object.assign({ silent: false }, opts || {});

  if (typeof config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string');
  }

  function installComposer() {
    return gulp.src(config.src)
      .pipe(composer({
        silent: opts.silent,
        bin: config.bin,
      }));
  }
  installComposer._config = config;
  installComposer._opts = opts;
  installComposer.displayName = 'install:composer';
  installComposer.description = 'Install Composer dependencies.';
  installComposer.options = {};
  return installComposer;
};

function composer(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull() && !file.isDirectory()) {
      return cb(null, file);
    }
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
