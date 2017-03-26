'use strict';

var spawn = require('child_process').spawn;
var gulp = require('gulp');
var which = require('npm-which');
var through = require('through2');
var gutil = require('gulp-util');
var merge = require('merge-stream');

var PLUGIN_NAME = 'lcm-test-phantomas-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  var _config = Object.assign({
    src: [],
    bin: null,
    baseUrl: null,
    artifactGlob: null,
  }, config);
  var _opts = Object.assign({ silent: false, artifactDir: null, baseUrl: null }, opts);

  if (_config.bin && typeof _config.bin !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'bin must be a string');
  }
  if (typeof _config.src !== 'string' && !Array.isArray(_config.src)) {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a gulp glob');
  }
  if (_config.artifactGlob && typeof _config.artifactGlob !== 'string' && !Array.isArray(_config.artifactGlob)) {
    throw new gutil.PluginError(PLUGIN_NAME, 'artifactGlob must be a gulp glob');
  }
  if (_config.baseUrl && typeof _config.baseUrl !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'baseUrl must be a string');
  }
  if (_opts.baseUrl && typeof _opts.baseUrl !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'baseUrl must be a string');
  }
  if (_opts.artifactDir && typeof _opts.artifactDir !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'artifactDir must be a string');
  }

  function testPhantomas() {
    return gulp.src(_config.src)
      .pipe(phantomas({
        bin: _config.bin,
        silent: _opts.silent,
        baseUrl: _opts.baseUrl || _config.baseUrl,
        artifactGlob: _config.artifactGlob,
        artifactDir: _opts.artifactDir
      }));
  }

  testPhantomas._config = _config;
  testPhantomas._opts = _opts;
  testPhantomas.displayName = 'test:phantomas';
  testPhantomas.description = 'Run Phantomas performance tests.';
  testPhantomas.options = {
    'artifact-dir': 'A directory to output the test artifacts to.',
    'base-url': 'The base URL to run tests on',
  };
  return testPhantomas;
};

function phantomas(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var spawnArgs = ['--config=' + file.path];
    var spawnOpts = {
      stdio: opts.silent ? 'ignore' : 'inherit',
    };

    if (opts.baseUrl) {
      spawnOpts.env = Object.assign({}, process.env, {
        BASE_URL: opts.baseUrl
      });
    }
    var bin = opts.bin || which(__dirname).sync('phantomas');

    var child = spawn(bin, spawnArgs, spawnOpts);
    child.on('error', function(err) {
      child.childErr = err;
    });
    child.on('close', function(code) {
      var err = code !== 0 ? new Error('Exited with code ' + code) : null;
      var merged = merge();

      if (opts.artifactGlob && opts.artifactDir) {
        merged.add(gulp.src(opts.artifactGlob)
          .pipe(gulp.dest(opts.artifactDir)));
      }
      merged.on('error', function (streamErr) {
        // An error here should take precedence over any backstop error.  It
        // has to be fixed before we can give a real report.
        err = new gutil.PluginError(PLUGIN_NAME, { error: streamErr });
        cb(err);
      });
      merged.on('end', function () {
        cb(err);
      });

      if (merged.isEmpty()) {
        merged.end();
        cb(err);
      }      else {
        merged.resume();
      }
    });
  });
}
