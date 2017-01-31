'use strict';

var gulp = require('gulp');
var behat = require('gulp-behat');

module.exports = function (config, opts) {
  function testBehat() {
    return gulp.src('behat.yml')
      .pipe(behat('', {
        format: opts.junitDir ? 'junit' : 'pretty',
        out: opts.junitDir ? path.join(opts.junitDir, 'behat') : null
      }));
  }

  testBehat.description = 'Run Behat tests.';
  testBehat.options = {
    'junit-dir': 'Directory to output JUnit results to.'
  };
  return testBehat;
};
