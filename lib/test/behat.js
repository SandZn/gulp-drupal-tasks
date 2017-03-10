'use strict';

var gulp = require('gulp');
var behat = require('gulp-behat');
var omit = require('lodash.omit');

module.exports = function (config, opts) {
  config = Object.assign({bin: ''}, config);
  opts = Object.assign({junitDir: null}, opts);

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
