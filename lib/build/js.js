'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var validator = require('../validator');

module.exports = function (config) {
  config = Object.assign({
    src: [],
    dest: null,
    concat: false,
    maps: false,
    min: false
  }, config);

  if(config.concat !== false && typeof config.concat !== 'string') {
    throw new Error('concat must be a string or `false`');
  }
  if(config.maps !== false && typeof config.maps !== 'string') {
    throw new Error('maps must be a string or `false`');
  }
  if(typeof config.min !== 'boolean') {
    throw new Error('min must be a boolean');
  }

  function buildJs() {
    return gulp
      .src(config.src)
      .pipe(config.maps ? sourcemaps.init() : gutil.noop())
      .pipe(config.concat ? concat(config.concat) : gutil.noop())
      .pipe(config.min
        ? minify({ ext: { src: '.js', min: '.min.js' } })
        : gutil.noop())
      .pipe(config.maps ? sourcemaps.write(config.maps) : gutil.noop())
      .pipe(config.dest ? gulp.dest(config.dest) : gutil.noop());
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
