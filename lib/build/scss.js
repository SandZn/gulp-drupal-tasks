'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');

module.exports = function (config, opts) {
  config = Object.assign({
    src: [],
    dest: null,
    maps: false,
    prefix: {},
    sassOptions: {},
  }, config);

  if(config.maps !== false && typeof config.maps !== 'string') {
    throw new Error('maps must be a string or `false`');
  }
  if(config.prefix !== false && typeof config.prefix !== 'object') {
    throw new Error('prefix must be a false or an object`');
  }
  if(typeof config.sassOptions !== 'object') {
    throw new Error('sassOptions must be an object');
  }

  function buildSass() {
    return gulp.src(config.src)
      .pipe(config.maps ? sourcemaps.init() : gutil.noop())
      .pipe(sass(config.sassOptions).on('error', sass.logError))
      .pipe(config.prefix ? autoprefixer(config.prefix) : gutil.noop())
      .pipe(csso(config.csso))
      .pipe(config.maps ? sourcemaps.write(config.maps) : gutil.noop())
      .pipe(config.dest ? gulp.dest(config.dest) : gutil.noop());
  }
  buildSass._config = config;
  buildSass._opts = opts;
  buildSass.description = 'Build SCSS files.';
  buildSass.options = {};
  return buildSass;
};
