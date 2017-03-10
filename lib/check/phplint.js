'use strict';

var gulp = require('gulp');
var phplint = require('gulp-phplint');
var PluginError = require('gulp-util').PluginError;
var Transform = require('stream').Transform;
var omit = require('lodash.omit');

module.exports = function (config, opts) {
  config = Object.assign({src: [], bin: ''}, config);

  function checkPhpLint() {
    var phplintConfig = omit(config, ['src', 'bin']);
    phplintConfig.notify = false;
    phplintConfig.skipPassedFiles = true;

    return gulp.src(config.src)
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
  checkPhpLint._config = config;
  checkPhpLint._opts = opts;
  checkPhpLint.displayName = 'check:phplint';
  checkPhpLint.description = 'Check PHPLint.';
  checkPhpLint.options = {};

  return checkPhpLint;
};
