'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var spawn = require('child_process').spawn;
var merge = require('merge-stream');
var through = require('through2');
var which = require('which');

var PLUGIN_NAME = 'lcm-test-backstop-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  var _config = Object.assign({
    src: [],
    dockerBin: null,
    junitGlob: null,
    artifactGlob: null,
    baseUrl: null
  }, config);
  var _opts = Object.assign({
    junitDir: null,
    artifactDir: null,
    silent: false,
    baseUrl: null
  }, opts);

  if (typeof _config.src !== 'string' && !Array.isArray(_config.src)) {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a gulp glob');
  }
  if (_config.dockerBin && typeof _config.dockerBin !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'dockerBin must be a string');
  }
  if (_config.junitGlob && typeof _config.junitGlob !== 'string' && !Array.isArray(_config.junitGlob)) {
    throw new gutil.PluginError(PLUGIN_NAME, 'junitGlob must be a gulp glob');
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
  if (_opts.junitDir && typeof _opts.junitDir !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'junitDir must be a string');
  }
  if (_opts.artifactDir && typeof _opts.artifactDir !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'artifactDir must be a string');
  }

  function testBackstop() {
    return gulp.src(_config.src)
      .pipe(backstopjs({
        baseUrl: _opts.baseUrl || _config.baseUrl,
        dockerBin: _config.dockerBin,
        artifactGlob: _config.artifactGlob,
        artifactDir: _opts.artifactDir,
        junitGlob: _config.junitGlob,
        junitDir: _opts.junitDir,
        rebase: _opts.rebase,
        silent: _opts.silent
      }));
  }
  testBackstop.displayName = 'test:backstopjs';
  testBackstop.description = 'Run BackstopJS tests.';
  testBackstop._config = _config;
  testBackstop._opts = _opts;
  testBackstop.options = {
    'artifact-dir': 'A directory to output the test artifacts to.',
    'junit-dir': 'A directory to output a junit formatted report to.',
    'rebase': 'Regenerate the reference screenshots.',
    'base-url': 'The base URL to run tests on',
  };
  return testBackstop;
};

function backstopjs(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var spawnBin = opts.dockerBin ? opts.dockerBin : which.sync('docker');
    var spawnArgs = [
      'run', '--rm', '-e', 'HOME=/tmp',
      '-u', process.getuid(),
      '-v', path.resolve(path.dirname(file.path)) + ':/src',
      '-e', 'BASE_URL=' + opts.baseUrl,
      // this is the docker image we use.
      'docksal/backstopjs@sha256:26084eb458305ebff9117635b37a70822b5141acfacc2354050d7d1dd32e92db',
      opts.rebase ? 'reference' : 'test',
      '--config=' + path.basename(file.path)
    ];
    var spawnOpts = {
      stdio: opts.silent ? 'ignore' : 'inherit',
    };
    var child = spawn(spawnBin, spawnArgs, spawnOpts);

    child.on('error', function(err) {
      child.childErr = err;
    });
    child.on('close', function(code) {
      var err = code !== 0 ? new Error('Backstopjs exited with code ' + code) : null;
      var merged = merge();
      if (opts.junitGlob && opts.junitDir) {
        merged.add(
          gulp.src(opts.junitGlob)
            .pipe(gulp.dest(opts.junitDir))
        );
      }

      if (opts.artifactGlob && opts.artifactDir) {
        merged.add(
          gulp.src(opts.artifactGlob)
            .pipe(gulp.dest(opts.artifactDir))
        );
      }
      merged.on('error', function(streamErr) {
        // An error here should take precedence over any backstop error.  It
        // has to be fixed before we can give a real report.
        err = new gutil.PluginError(PLUGIN_NAME, { error: streamErr });
        cb(err);
      });
      merged.on('end', function() {
        cb(err);
      });

      if (merged.isEmpty()) {
        merged.end();
        cb(err);
      } else {
        merged.resume();
      }
    });
  });
}
