'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var validator = require('../validator');

module.exports = function (config) {
  config = config || [];

  function buildJs() {
    validator(buildJs.schema, config);
    var streams = config.map(function(pack) {
      return gulp
        .src(pack.src)
        .pipe(pack.maps ? sourcemaps.init() : gutil.noop())
        .pipe(pack.concat ? concat(pack.concat) : gutil.noop())
        .pipe(pack.min
          ? minify({ ext: { src: '.js', min: '.min.js' } })
          : gutil.noop())
        .pipe(pack.maps ? sourcemaps.write(pack.maps) : gutil.noop())
        .pipe(gulp.dest(pack.dest));
    });
    var merged = merge();
    streams.forEach(merged.add);

    return merged.isEmpty() ? null : merged;
  }
  buildJs.description = 'Build JS files.';
  buildJs.options = {};
  buildJs.schema = {
    type: 'array',
    default: [],
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
        maps: {
          default: false,
          oneOf: [
            { type: 'string' },
            { enum: [false] }
          ]
        },
        min: {
          type: 'boolean',
          default: false,
        }
      }
    }
  };
  return buildJs;
};
