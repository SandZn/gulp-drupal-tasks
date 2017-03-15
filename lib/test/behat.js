'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var behat = require('gulp-behat');
var omit = require('lodash.omit');
var path = require('path');

var PLUGIN_NAME = 'lcm-test-behat-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({ bin: '' }, config);
  opts = Object.assign({ junitDir: null }, opts);

  if (typeof config.src !== 'undefined' && typeof config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string');
  }

  function testBehat() {
    var behatConfig = omit(config, ['bin']);
    behatConfig.format = opts.junitDir ? 'junit' : 'pretty';
    behatConfig.out = opts.junitDir ? path.join(opts.junitDir, 'behat') : null;
    // This MUST be true in order for failures to trigger a non-0 exit code.
    behatConfig.notify = true;

    return gulp.src('')
      .pipe(behat(config.bin, behatConfig));
  }

  testBehat._config = config;
  testBehat._opts = opts;
  testBehat.displayName = 'test:behat';
  testBehat.description = 'Run Behat tests.';
  testBehat.options = {
    'junit-dir': 'Directory to output JUnit results to.'
  };
  return testBehat;
};
