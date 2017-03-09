'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minify = require('gulp-minify');

module.exports = function (config, opts) {
  config = Object.assign({
    src: [],
    dest: null,
    concat: false,
    maps: false,
    min: false
  }, config);
  opts = Object.assign({}, opts);

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
  buildJs._config = config;
  buildJs._opts = opts;
  buildJs.description = 'Build JS files.';
  buildJs.options = {};
  return buildJs;
};
