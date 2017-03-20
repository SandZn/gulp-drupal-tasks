'use strict';

var gulp = require('gulp');
var which = require('npm-which')(process.cwd());
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');

var PLUGIN_NAME = 'lcm-bower-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  // Clone config.
  config = Object.assign({ src: [], bin: null }, config || {});
  opts = Object.assign({ silent: false }, opts || {});

  function installBower() {
    return gulp.src(config.src)
      .pipe(bower({
        bin: config.bin,
        silent: opts.silent
      }));
  }
  installBower._config = config;
  installBower._opts = opts;
  installBower.displayName = 'install:bower';
  installBower.description = 'Install Bower dependencies.';
  installBower.options = {};
  return installBower;
};

function bower(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull() && !file.isDirectory()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var execOpts = {};
    if (file.isDirectory()) {
      execOpts.cwd = file.path;
    }    else {
      execOpts.cwd = path.dirname(file.path);
    }
    var bin = opts.bin || which.sync('bower');

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
