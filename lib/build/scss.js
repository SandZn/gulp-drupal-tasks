'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
// We use some lazy requires here for loading performance.
// See the task function for more info.


var PLUGIN_NAME = 'lcm-build-scss-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
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
    throw new gutil.PluginError(PLUGIN_NAME, 'maps must be a string or `false`');
  }
  if (config.prefix !== false && typeof config.prefix !== 'object') {
    throw new gutil.PluginError(PLUGIN_NAME, 'prefix must be a false or an object`');
  }
  if (typeof config.sassOptions !== 'object') {
    throw new gutil.PluginError(PLUGIN_NAME, 'sassOptions must be an object');
  }

  function buildSass() {
    var sass = require('gulp-sass');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('gulp-autoprefixer');
    var csso = require('gulp-csso');

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
  buildSass._watch = config.src.length ? config.src : null;
  buildSass.displayName = 'build:scss';
  buildSass.description = 'Build SCSS files.';
  buildSass.options = {};
  return buildSass;
};
