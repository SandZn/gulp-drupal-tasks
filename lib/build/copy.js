'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var validator = require('../validator');

module.exports = function (config) {
  config = config || {};
  function copy() {
    validator(copy.schema, config);
    return gulp.src(config.src)
      .pipe(config.imagemin ? require('gulp-imagemin')() : gutil.noop())
      .pipe(gulp.dest(config.dest));
  }
  copy.description = 'Copy source files and minify images.';
  copy.options = {};
  copy.schema = {
    type: 'object',
    required: ['src', 'dest'],
    properties: {
      src: {
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: { type: 'string' }
          }
        ]
      },
      dest: {
        type: 'string'
      },
      imagemin: {
        type: 'boolean'
      }
    }
  };
  return copy;
};
