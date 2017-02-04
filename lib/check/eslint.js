'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var validator = require('../validator');

module.exports = function (config) {
  config = config || {};

  function checkEslint() {
    validator(checkEslint.schema, config);
    return gulp
      .src(config.jsCheck)
      .pipe(eslint())
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
      jsCheck: {
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
