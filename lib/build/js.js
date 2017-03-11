'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
// We use some lazy requires here for loading performance.
// See the task function for more info.

var PLUGIN_NAME = 'lcm-build-js-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'Invalid opts: ' + typeof opts);
  }
  config = Object.assign({
    src: [],
    dest: null,
    concat: false,
    maps: false,
    min: false
  }, config);
  opts = Object.assign({}, opts);

  if (config.concat !== false && typeof config.concat !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'concat must be a string or `false`');
  }
  if (config.maps !== false && typeof config.maps !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'maps must be a string or `false`');
  }
  if (typeof config.min !== 'boolean') {
    throw new gutil.PluginError(PLUGIN_NAME, 'min must be a boolean');
  }

  function buildJs() {
    var sourcemaps = require('gulp-sourcemaps');
    var concat = require('gulp-concat');
    var minify = require('gulp-minify');

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
  buildJs.displayName = 'build:js';
  buildJs.description = 'Build JS files.';
  buildJs.options = {};
  return buildJs;
};
