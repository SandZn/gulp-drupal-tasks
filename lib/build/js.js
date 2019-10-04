'use strict';

var gulp = require('gulp');
var through = require('through2');
// We use some lazy requires here for loading performance.
// See the task function for more info.

module.exports = function (config) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new Error('config must be an object');
  }
  config = Object.assign({
    src: [],
    dest: null,
    concat: false,
    maps: './',
    min: true
  }, config);

  if (config.concat !== false && typeof config.concat !== 'string') {
    throw new Error('concat must be a string or `false`');
  }
  if (config.maps !== false && typeof config.maps !== 'string') {
    throw new Error('maps must be a string or `false`');
  }
  if (typeof config.min !== 'boolean') {
    throw new Error('min must be a boolean');
  }

  function buildJs() {
    if (config.src.length > 0) {
      var sourcemaps = require('gulp-sourcemaps');
      var concat = require('gulp-concat');
      var minify = require('gulp-minify');

      return gulp
          .src(config.src)
          .pipe(config.maps ? sourcemaps.init() : through.obj())
          .pipe(config.concat ? concat(config.concat) : through.obj())
          .pipe(config.min
              ? minify({ ext: { src: '.js', min: '.min.js' } })
              : through.obj())
          .pipe(config.maps ? sourcemaps.write(config.maps) : through.obj())
          .pipe(config.dest ? gulp.dest(config.dest) : through.obj());
    }
  }
  buildJs._config = config;
  buildJs._watch = config.src.length ? config.src : null;
  buildJs.displayName = 'build:js';
  buildJs.description = 'Build JS files.';
  buildJs.options = {};
  return buildJs;
};
