'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');

module.exports = function (config) {
  function checkEslint() {
    return gulp
      .src(config.jsCheck)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  }
  checkEslint.description = 'Check javascript for ESLint violations.';
  checkEslint.options = {};
  return checkEslint;
};
