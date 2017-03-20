'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
// We use some lazy requires here for loading performance.
// See the task function for more info.

var PLUGIN_NAME = 'lcm-check-eslint-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({ src: [], config: null, ignorePath: null }, config);
  opts = Object.assign({ silent: false, fix: false }, opts);

  function checkEslint() {
    var eslint = require('gulp-eslint');
    return gulp
      .src(config.src)
      .pipe(eslint({
        fix: opts.fix,
        config: config.config,
        ignorePath: config.ignorePath
      }))
      .pipe(opts.silent ? gutil.noop() : eslint.format(null))
      .pipe(eslint.failAfterError());
  }
  checkEslint._config = config;
  checkEslint._opts = opts;
  checkEslint.displayName = 'check:eslint';
  checkEslint.description = 'Check javascript for ESLint violations.';
  checkEslint.options = {};
  return checkEslint;
};
