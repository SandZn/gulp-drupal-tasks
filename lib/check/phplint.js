'use strict';

var gulp = require('gulp');
var phplint = require('gulp-phplint');
var validator = require('../validator');
var PluginError = require('gulp-util').PluginError;
var Transform = require('stream').Transform;
var omit = require('lodash.omit');

module.exports = function (config) {
  config = config || {};
  function checkPhpLint() {
    validator(checkPhpLint.schema, config);
    var phplintConfig = omit(config, ['pattern', 'bin']);
    phplintConfig.notify = false;
    phplintConfig.skipPassedFiles = true;

    return gulp.src(config.pattern)
      .pipe(phplint(config.bin, phplintConfig))
      // Custom failure handler to return a PluginError.
      .pipe(new Transform({
        objectMode: true,
        transform: function(file, enc, cb) {
          var report = file.phplintReport || {};
          if (!report || !report.error) {
            cb(null, file);
          }
          var err = new PluginError('gulp-phplint', {
            name: 'PHPLintError',
            message: report.message,
            fileName: file.path,
            lineNumber: report.line
          });
          cb(err, file);
        }
      }));
  }
  checkPhpLint.description = 'Check PHPLint.';
  checkPhpLint.options = {};
  checkPhpLint.schema = {
    type: 'object',
    properties: {
      bin: {
        type: 'string',
        default: '',
      },
      pattern: {
        default: [],
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: { type: 'string' }
          }
        ]
      },
    }
  };

  return checkPhpLint;
};
