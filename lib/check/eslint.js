'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var validator = require('../validator');
var omit = require('lodash.omit');

module.exports = function (config) {
  config = config || {};

  function checkEslint() {
    validator(checkEslint.schema, config);
    var eslintConfig = omit(config, ['logOutput', 'pattern']);
    return gulp
      .src(config.pattern)
      .pipe(eslint(eslintConfig))
      .pipe(eslint.format(null, config.logOutput))
      .pipe(eslint.failAfterError());
  }
  checkEslint.description = 'Check javascript for ESLint violations.';
  checkEslint.options = {};
  checkEslint.schema = {
    type: 'object',
    properties: {
      logOutput: {
        typeOf: 'function',
      },
      pattern: {
        default: [],
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: { type: 'string' }
          }
        ]
      }
    }
  };
  return checkEslint;
};
