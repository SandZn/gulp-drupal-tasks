'use strict';

var gulp = require('gulp');
var phplint = require('gulp-phplint');

module.exports = function (config) {
  function checkPhpLint() {
    return gulp.src(config.phpCheck)
      .pipe(phplint('', { notify: false, skipPassedFiles: true }))
      .pipe(phplint.reporter('fail'));
  }
  checkPhpLint.description = 'Check PHPLint.';
  checkPhpLint.options = {};

  return checkPhpLint;
};
