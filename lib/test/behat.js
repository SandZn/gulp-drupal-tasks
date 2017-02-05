'use strict';

var gulp = require('gulp');
var behat = require('gulp-behat');
var validator = require('../validator');
var omit = require('lodash.omit');

module.exports = function (config) {
  config = config || {};

  function testBehat() {
    validator(testBehat.schema, config);

    var behatConfig = omit(config, ['bin', 'junitDir']);
    behatConfig.format = config.junitDir ? 'junit' : 'pretty';
    behatConfig.out = config.junitDir ? path.join(pack.junitDir, 'behat') : null;
    // This MUST be true in order for failures to trigger a non-0 exit code.
    behatConfig.notify = true;

    return gulp.src('')
      .pipe(behat(config.bin, behatConfig));
  }

  testBehat.description = 'Run Behat tests.';
  testBehat.options = {
    'junit-dir': 'Directory to output JUnit results to.'
  };
  testBehat.schema = {
    type: 'object',
    properties: {
      bin: {
        type: 'string',
        default: '',
      },
      junitDir: { type: 'string' },
    }
  };
  return testBehat;
};
