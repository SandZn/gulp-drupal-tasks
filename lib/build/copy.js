'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var imagemin = require('gulp-imagemin');
var gutil = require('gulp-util');
var validator = require('../validator');

module.exports = function (config) {
  function copy() {
    validator(copy.schema, config);
    var streams = config.copy.map(function(pack) {
      return gulp
        .src(pack.src)
        .pipe(pack.imagemin ? imagemin() : gutil.noop())
        .pipe(gulp.dest(pack.dest));
    });

    var merged = merge();
    streams.forEach(merged.add);

    return merged.isEmpty() ? null : merged;
  }
  copy.description = 'Copy source files and minify images.';
  copy.options = {};
  copy.schema = {
    type: 'object',
    properties: {
      copy: {
        default: [],
        type: 'array',
        items: {
          type: 'object',
          required: ['src', 'dest'],
          src: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: { type: 'string' }
              }
            ]
          },
          dest: {
            type: 'string'
          },
          imagemin: {
            type: 'boolean'
          }
        }
      }
    }
  };
  return copy;
};
