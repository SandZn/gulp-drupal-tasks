'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

module.exports = function (config, opts) {
  config = Object.assign({
    src: [],
    dest: null,
    imagemin: false,
  }, config);

  function copy() {
    return gulp.src(config.src)
      .pipe(config.imagemin ? require('gulp-imagemin')() : gutil.noop())
      .pipe(config.dest ? gulp.dest(config.dest) : gutil.noop());
  }
  copy._config = config;
  copy._opts = opts;
  copy.displayName = 'build:copy';
  copy.description = 'Copy source files and minify images.';
  copy.options = {};
  return copy;
};
