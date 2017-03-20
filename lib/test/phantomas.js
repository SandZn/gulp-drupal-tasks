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
  config = Object.assign({
    src: [],
    bin: null,
    baseUrl: null,
    artifactGlob: null,
  }, config);
  opts = Object.assign({ silent: false, artifactDir: null }, opts);

  function testPhantomas() {
    return gulp.src(config.src)
      .pipe(phantomas({
        bin: config.bin,
        silent: opts.silent,
        artifactGlob: config.artifactGlob,
        artifactDir: opts.artifactDir
      }));
  }

  testPhantomas._config = config;
  testPhantomas._opts = opts;
  testPhantomas.displayName = 'test:phantomas';
  testPhantomas.description = 'Run Phantomas performance tests.';
  testPhantomas.options = {
    'artifact-dir': 'A directory to output the test artifacts to.',
  };
  return testPhantomas;
};

function phantomas(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
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
