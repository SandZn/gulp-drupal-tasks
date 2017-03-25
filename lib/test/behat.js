'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');
var which = require('which');
var spawn = require('child_process').spawn;

var PLUGIN_NAME = 'lcm-test-behat-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  var _config = Object.assign({
    bin: '',
    baseUrl: undefined,
    suite: undefined
  }, config);
  var _opts = Object.assign({
    junitDir: null,
    silent: false,
    baseUrl: null
  }, opts);

  if (typeof _config.src !== 'undefined' && typeof _config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string');
  }
  if (_config.bin && typeof _config.bin !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'bin must be a string');
  }
  if (_config.suite && typeof _config.suite !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'suite must be a string');
  }
  if (_config.baseUrl && typeof _config.baseUrl !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'baseUrl must be a string');
  }
  if (_opts.baseUrl && typeof _opts.baseUrl !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'baseUrl must be a string');
  }
  if (_opts.junitDir && typeof _opts.junitDir !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'junitDir must be a string');
  }

  function testBehat() {
    return gulp.src(_config.src)
      .pipe(behat({
        bin: _config.bin,
        baseUrl: _opts.baseUrl || _config.baseUrl,
        suite: _config.suite,
        format: _opts.junitDir ? 'junit' : 'pretty',
        out: _opts.junitDir ? path.join(_opts.junitDir, 'behat') : null,
        silent: _opts.silent
      }));
  }

  testBehat._config = _config;
  testBehat._opts = _opts;
  testBehat.displayName = 'test:behat';
  testBehat.description = 'Run Behat tests.';
  testBehat.options = {
    'junit-dir': 'Directory to output JUnit results to.',
    'base-url': 'The base URL to run tests on',
  };
  return testBehat;
};

function behat(opts) {
  return through.obj(function(file, enc, cb) {
    var bin = opts.bin || which.sync('behat');
    var spawnArgs = ['--config=' + file.path];
    var spawnOpts = {
      stdio: opts.silent ? 'ignore' : 'inherit',
    };

    if (typeof opts.format === 'string') {
      spawnArgs.push('--format=' + opts.format);
    }
    if (typeof opts.out === 'string') {
      spawnArgs.push('--out=' + opts.out);
    }
    if (typeof opts.suite === 'string') {
      spawnArgs.push('--suite=' + opts.suite);
    }
    if (opts.baseUrl) {
      spawnOpts.env = Object.assign({}, process.env, {
        /* eslint camelcase: 0 */
        BEHAT_PARAMS: JSON.stringify({ extensions: { 'Behat\\MinkExtension': { base_url: opts.baseUrl } } })
      });
    }

    var child = spawn(bin, spawnArgs, spawnOpts);
    child.on('error', function(err) {
      child.childErr = err;
    });
    child.on('close', function(code) {
      if (child.childErr) {
        return cb(child.childErr);
      }
      if (code !== 0) {
        return cb(new Error('Exited with code ' + code));
      }
      cb(null, file);
    });
  });
}
