'use strict';

var gulp = require('gulp');
var phpcs = require('gulp-phpcs');

module.exports = function (config) {
  function checkPhpcs() {
    return gulp.src(config.phpCheck)
      .pipe(phpcs({
        bin: 'vendor/bin/phpcs',
        standard: config.phpcsStandard
      }))
      .pipe(phpcs.reporter('log'))
      .pipe(phpcs.reporter('fail'));
  }

  checkPhpcs.description = 'Check PHP for Codesniffer violations.';
  checkPhpcs.options = {};

  return checkPhpcs;
};
