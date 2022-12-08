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
    maps: './',
    min: true,
    concat: false,
    prefix: { browsers: 'last 2 versions' },
    sassOptions: {},
  }, config);

  if (config.maps !== false && typeof config.maps !== 'string') {
    throw new Error('maps must be a string or `false`');
  }
  if (config.prefix !== false && typeof config.prefix !== 'object') {
    throw new Error('prefix must be a false or an object`');
  }
  if (typeof config.sassOptions !== 'object') {
    throw new Error('sassOptions must be an object');
  }

  function buildSass() {
    if (config.src.length > 0) {
      var sass = require('gulp-sass')(require('sass'));
      var sourcemaps = require('gulp-sourcemaps');
      var autoprefixer = require('gulp-autoprefixer');
      var csso = require('gulp-csso');
      var concat = require('gulp-concat');
      config.sassOptions.importer = require('node-sass-tilde-importer');

      return gulp.src(config.src)
          .pipe(config.maps ? sourcemaps.init() : through.obj())
          .pipe(config.concat ? concat(config.concat) : through.obj())
          .pipe(sass(config.sassOptions).on('error', sass.logError))
          .pipe(config.prefix ? autoprefixer(config.prefix) : through.obj())
          .pipe(csso(config.csso))
          .pipe(config.maps ? sourcemaps.write(config.maps) : through.obj())
          .pipe(config.dest ? gulp.dest(config.dest) : through.obj());
    }
  }
  buildSass._config = config;
  buildSass._watch = config.src.length ? config.src : null;
  buildSass.displayName = 'build:scss';
  buildSass.description = 'Build SCSS files.';
  buildSass.options = {};
  return buildSass;
};
