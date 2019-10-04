'use strict';

var gulp = require('gulp');
var through = require('through2');

module.exports = function (config) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new Error('config must be an object');
  }
  config = Object.assign({
    src: [],
    dest: null,
    imagemin: false,
  }, config);

  function copy() {
    if (config.src.length) {
      return gulp.src(config.src)
          .pipe(config.imagemin ? require('gulp-imagemin')() : through.obj())
          .pipe(config.dest ? gulp.dest(config.dest) : through.obj());
    }
  }
  copy._config = config;
  copy._watch = config.src.length ? config.src : null;
  copy.displayName = 'build:copy';
  copy.description = 'Copy source files and minify images.';
  copy.options = {};
  return copy;
};
