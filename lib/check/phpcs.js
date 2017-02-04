'use strict';

var gulp = require('gulp');
var phpcs = require('gulp-phpcs');
var validator = require('../validator');
var omit = require('lodash.omit');

module.exports = function (config) {
  config = config || {};

  function checkPhpcs() {
    validator(checkPhpcs.schema, config);
    var phpcsConfig = omit(config, ['pattern']);
    return gulp.src(config.pattern)
      .pipe(phpcs(phpcsConfig))
      .pipe(phpcs.reporter('log'))
      .pipe(phpcs.reporter('fail'));
  }

  checkPhpcs.description = 'Check PHP for Codesniffer violations.';
  checkPhpcs.options = {};
  checkPhpcs.schema = {
    type: 'object',
    properties: {
      pattern: {
        default: [],
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: { type: 'string' }
          }
        ]
      },
    }
  }

  return checkPhpcs;
};
