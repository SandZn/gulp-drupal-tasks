'use strict';

var gulp = require('gulp');
var which = require('npm-which')(process.cwd());
var exec = require('child_process').exec;
var gutil = require('gulp-util');
var through = require('through2');
var omit = require('lodash.omit');
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
  config = Object.assign({ src: [] }, config || {});

  function installBower() {
    var bowerConfig = omit(config, ['src']);
    return gulp.src(config.src)
      .pipe(bower(bowerConfig));
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

    exec(bin + ' install', execOpts, function(err) {
      if (err) {
        return cb(new gutil.PluginError(PLUGIN_NAME, {
          error: err
        }));
      }
      cb(null, file);
    });
  });
}
