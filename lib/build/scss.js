'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var validator = require('../validator');

module.exports = function (config) {
  config = config || {};
  function buildSass() {
    validator(buildSass.schema, config);
    return gulp.src(config.src)
      .pipe(config.maps ? sourcemaps.init() : gutil.noop())
      .pipe(sass(config.sassOptions).on('error', sass.logError))
      .pipe(config.prefix ? autoprefixer(config.prefix) : gutil.noop())
      .pipe(csso(config.csso))
      .pipe(config.maps ? sourcemaps.write(config.maps) : gutil.noop())
      .pipe(gulp.dest(config.dest));
  }
  buildSass.description = 'Build SCSS files.';
  buildSass.options = {};
  buildSass.schema = {
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
      prefix: { type: 'object' },
      sassOptions: { type: 'object' },
      csso: { type: 'object' },
      maps: {
        default: false,
        oneOf: [
          { type: 'string' },
          { enum: [false] }
        ]
      },
    }
  };
  return buildSass;
};
