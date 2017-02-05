'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var validator = require('../validator');

module.exports = function (config) {
  config = config || {};

  function buildJs() {
    validator(buildJs.schema, config);

    return gulp
      .src(config.src)
      .pipe(config.maps ? sourcemaps.init() : gutil.noop())
      .pipe(config.concat ? concat(config.concat) : gutil.noop())
      .pipe(config.min
        ? minify({ ext: { src: '.js', min: '.min.js' } })
        : gutil.noop())
      .pipe(config.maps ? sourcemaps.write(config.maps) : gutil.noop())
      .pipe(gulp.dest(config.dest));
  }
  buildJs.description = 'Build JS files.';
  buildJs.options = {};
  buildJs.schema = {
    type: 'object',
    required: ['src', 'dest'],
    properties: {
      src: {
        oneOf: [
          { type: 'string' },
          { type: 'array', items: { type: 'string' } }
        ]
      },
      dest: { type: 'string' },
      maps: {
        default: false,
        oneOf: [
          { type: 'string' },
          { enum: [false] }
        ]
      },
      min: {
        type: 'boolean',
        default: false,
      }
    }
  };
  return buildJs;
};
