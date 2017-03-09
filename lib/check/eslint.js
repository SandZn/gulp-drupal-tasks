'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var omit = require('lodash.omit');

module.exports = function (config, opts) {
  config = Object.assign({src: []}, config);

  function checkEslint() {
    var eslintConfig = omit(config, ['logOutput', 'pattern']);
    return gulp
      .src(config.src)
      .pipe(eslint(eslintConfig))
      .pipe(eslint.format(null, config.logOutput))
      .pipe(eslint.failAfterError());
  }
  checkEslint._config = config;
  checkEslint._opts = opts;
  checkEslint.description = 'Check javascript for ESLint violations.';
  checkEslint.options = {};
  return checkEslint;
};
