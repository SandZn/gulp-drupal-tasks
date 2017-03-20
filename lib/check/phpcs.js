'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var phpcs = require('gulp-phpcs');

var PLUGIN_NAME = 'lcm-check-phpcs-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({
    src: [],
    bin: null,
    standard: null
  }, config);
  opts = Object.assign({ silent: false }, opts);

  function checkPhpcs() {
    var phpcsConfig = {
      bin: config.bin,
    };
    if (config.standard) {
      phpcsConfig.standard = config.standard;
    }
    return gulp.src(config.src)
      .pipe(phpcs(phpcsConfig))
      .pipe(opts.silent ? gutil.noop() : phpcs.reporter('log'))
      .pipe(phpcs.reporter('fail'));
  }

  checkPhpcs._config = config;
  checkPhpcs._opts = opts;
  checkPhpcs.displayName = 'check:phpcs';
  checkPhpcs.description = 'Check PHP for Codesniffer violations.';
  checkPhpcs.options = {};
  return checkPhpcs;
};
