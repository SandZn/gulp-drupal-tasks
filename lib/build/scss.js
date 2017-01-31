'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');

module.exports = function (config) {
  config = config || [];
  function buildSass() {
    var streams = config.map(function(pack) {
      return gulp.src(pack.src)
        .pipe(pack.maps ? sourcemaps.init() : gutil.noop())
        .pipe(sass(pack.sassOptions).on('error', sass.logError))
        .pipe(pack.prefix ? autoprefixer(pack.prefix) : gutil.noop())
        .pipe(csso(pack.csso))
        .pipe(pack.maps ? sourcemaps.write(pack.maps) : gutil.noop())
        .pipe(gulp.dest(pack.dest));
    });
    var merged = merge();
    streams.forEach(merged.add);
    return merged.isEmpty() ? null : merged;
  }
  buildSass.description = 'Build SCSS files.';
  buildSass.options = {};
  buildSass.schema = {
    type: 'array',
    items: {
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
    }
  };
  return buildSass;
};
