'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var Transform = require('stream').Transform;
var omit = require('lodash.omit');
// We use some lazy requires here for loading performance.
// See the task function for more info.

var PLUGIN_NAME = 'lcm-check-phplint-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({ src: [], bin: '' }, config);

  function checkPhpLint() {
    var phplint = require('gulp-phplint');
    var phplintConfig = omit(config, ['src', 'bin']);
    phplintConfig.notify = false;
    phplintConfig.skipPassedFiles = true;

    return gulp.src(config.src)
      .pipe(phplint(config.bin, phplintConfig))
      // Custom failure handler to return a PluginError.
      .pipe(new Transform({
        objectMode: true,
        transform: function(file, enc, cb) {
          var report = file.phplintReport;
          var err;
          if (report && report.error) {
            err = new gutil.PluginError(PLUGIN_NAME, {
              name: 'PHPLintError',
              message: report.message,
              fileName: file.path,
              lineNumber: report.line
            });
          }
          cb(err, file);
        }
      }));
  }
  checkPhpLint._config = config;
  checkPhpLint._opts = opts;
  checkPhpLint.displayName = 'check:phplint';
  checkPhpLint.description = 'Check PHPLint.';
  checkPhpLint.options = {};

  return checkPhpLint;
};
