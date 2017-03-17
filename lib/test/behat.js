'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');
var which = require('which');
var exec = require('child_process').exec;

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
    return gulp.src(config.src)
      .pipe(behat({
        bin: config.bin,
        baseUrl: config.baseUrl,
        suite: config.suite,
        format: opts.junitDir ? 'junit' : 'pretty',
        out: opts.junitDir ? path.join(opts.junitDir, 'behat') : null
      }));
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

function behat(opts) {
  return through.obj(function(file, enc, cb) {
    var bin = opts.bin || which.sync('behat');

    var cli = bin;
    if (typeof opts.format === 'string') {
      cli += ' --format=' + opts.format;
    }
    if (typeof opts.out === 'string') {
      cli += ' --out=' + opts.out;
    }
    if (typeof opts.suite === 'string') {
      cli += ' --suite=' + opts.suite;
    }
    cli += ' --config=' + file.path;

    var execOpts = {};
    if (opts.baseUrl) {
      // Set the BEHAT_PARAMS environment variable.
      execOpts.env = Object.assign({}, process.env, {
        /* eslint camelcase: 0 */
        BEHAT_PARAMS: JSON.stringify({ extensions: { 'Behat\\MinkExtension': { base_url: opts.baseUrl } } })
      });
    }

    exec(cli, execOpts, function(err) {
      cb(err, file);
    });
  });
}
