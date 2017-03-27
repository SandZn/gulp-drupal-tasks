'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdir-recursive').mkdirSync;
var fs = require('fs');
// We use some lazy requires here for loading performance.
// See the task function for more info.

var PLUGIN_NAME = 'lcm-check-eslint-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({ src: [], config: null, ignorePath: null }, config);
  opts = Object.assign({ silent: false, fix: false }, opts);

  function checkEslint() {
    var eslint = require('gulp-eslint');
    var gulpif = require('gulp-if');

    var junitReporter = null;
    if (opts.junitDir) {
      // Create the directory if it doesn't exist.
      // This matches the behavior of other tasks.
      mkdirp(opts.junitDir);
      junitReporter = eslint.format('junit', new fs.WriteStream(path.join(opts.junitDir, 'eslint.xml')));
    }
    return gulp
      // Without a base, gulp puts fixed files in the wrong place.
      .src(config.src, { base: '.' })
      .pipe(eslint({
        fix: opts.fix,
        config: config.config,
        ignorePath: config.ignorePath
      }))
      .pipe(opts.silent ? gutil.noop() : eslint.format(null))
      .pipe(junitReporter ? junitReporter : gutil.noop())
      // Write back the fixed file contents.
      .pipe(gulpif(isFileFixed, gulp.dest('.')))
      .pipe(eslint.failAfterError());
  }
  checkEslint._config = config;
  checkEslint._opts = opts;
  checkEslint._watch = config.src;
  checkEslint.displayName = 'check:eslint';
  checkEslint.description = 'Check javascript for ESLint violations.';
  checkEslint.options = {
    'junit-dir': 'Directory to output JUnit results to.',
    'fix': 'Automatically fix code style violations.'
  };
  return checkEslint;
};

function isFileFixed(file) {
  return file.eslint && file.eslint.fixed;
}
