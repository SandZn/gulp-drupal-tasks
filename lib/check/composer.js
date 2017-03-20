'use strict';

var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var through = require('through2');
var gulp = require('gulp');
var which = require('which');

var PLUGIN_NAME = 'lcm-check-composer-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({
    src: './composer.json',
    bin: null,
  }, config || {});
  opts = Object.assign({ silent: false }, opts || {});

  if (typeof config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string');
  }

  function checkComposer() {
    return gulp.src(config.src)
      .pipe(composer({
        bin: config.bin,
        silent: opts.silent
      }));
  }
  checkComposer._config = config;
  checkComposer._opts = opts;
  checkComposer.displayName = 'check:composer';
  checkComposer.description = 'Check composer.json syntax.';
  checkComposer.options = {};
  return checkComposer;
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
      stdio: opts.silent ? 'ignore' : 'inherit',
    };
    var bin = opts.bin || which.sync('composer');
    var child = spawn(bin, ['validate', file.path], execOpts, {
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
