'use strict';

var gulp = require('gulp');
var phpcs = require('gulp-phpcs');
var omit = require('lodash.omit');

module.exports = function (config, opts) {
  config = Object.assign({src: []}, config);

  function checkPhpcs() {
    var phpcsConfig = omit(config, ['src']);
    return gulp.src(config.src)
      .pipe(phpcs(phpcsConfig))
      .pipe(phpcs.reporter('log'))
      .pipe(phpcs.reporter('fail'));
  }

  checkPhpcs._config = config;
  checkPhpcs._opts = opts;
  checkPhpcs.description = 'Check PHP for Codesniffer violations.';
  checkPhpcs.options = {};
  return checkPhpcs;
};
