'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var which = require('which');
var spawn = require('child_process').spawn;

var PLUGIN_NAME = 'lcm-test-phpunit-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  var _config = Object.assign({
    bin: '',
    testsuite: undefined,
    group: undefined
  }, config);
  var _opts = Object.assign({
    junitDir: null,
    silent: false,
    baseUrl: null
  }, opts);

  if (_config.src && typeof _config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string');
  }
  if (_config.bin && typeof _config.bin !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'bin must be a string');
  }
  if (_config.testsuite && typeof _config.testsuite !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'testsuite must be a string');
  }
  if (_config.group && typeof _config.group !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'group must be a string');
  }
  if (_config.baseUrl && typeof _config.baseUrl !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'baseUrl must be a string');
  }
  if (_opts.baseUrl && typeof _opts.baseUrl !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'baseUrl must be a string');
  }

  function testPhpUnit() {
    return gulp.src(config.src)
      .pipe(phpunit({
        bin: _config.bin,
        testsuite: _config.testsuite,
        group: _config.group,
        silent: _opts.silent,
        junitDir: _opts.junitDir,
        baseUrl: _opts.baseUrl || _config.baseUrl
      }));
  }

  testPhpUnit._config = _config;
  testPhpUnit._opts = _opts;
  testPhpUnit.displayName = 'test:phpunit';
  testPhpUnit.description = 'Run PhpUnit tests.';
  testPhpUnit.options = {
    'junit-dir': 'Directory to output JUnit results to.',
    'base-url': 'The base URL to run tests on',
  };
  return testPhpUnit;
};

function phpunit(opts) {
  return through.obj(function(file, enc, cb) {
    var bin = opts.bin || which.sync('phpunit');
    var spawnArgs = ['--config=' + file.path];
    var spawnOpts = {
      stdio: opts.silent ? 'ignore' : 'inherit',
      env: process.env
    };
    if (typeof opts.testsuite === 'string') {
      spawnArgs.push('--testsuite=' + opts.testsuite);
    }
    if (typeof opts.group === 'string') {
      spawnArgs.push('--group=' + opts.group);
    }
    if (typeof opts.junitDir === 'string') {
      spawnArgs.push('--log-junit=' + opts.junitDir + '/phpunit.xml');
    }
    if (typeof opts.baseUrl === 'string') {
      spawnOpts.env.SIMPLETEST_BASE_URL = opts.baseUrl;
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
