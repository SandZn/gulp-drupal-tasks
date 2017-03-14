'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var phpcs = require('gulp-phpcs');
var omit = require('lodash.omit');

var PLUGIN_NAME = 'lcm-check-phpcs-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({ src: [], bin: 'vendor/bin/phpcs' }, config);

  function checkPhpcs() {
    var phpcsConfig = omit(config, ['src']);
    return gulp.src(config.src)
      .pipe(phpcs(phpcsConfig))
      .pipe(phpcs.reporter('log'))
      .pipe(phpcs.reporter('fail'));
  }

  checkPhpcs._config = config;
  checkPhpcs._opts = opts;
  checkPhpcs.displayName = 'check:phpcs';
  checkPhpcs.description = 'Check PHP for Codesniffer violations.';
  checkPhpcs.options = {};
  return checkPhpcs;
};
