'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var exec = require('child_process').exec;
var merge = require('merge-stream');

var PLUGIN_NAME = 'lcm-test-backstop-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  config = Object.assign({
    src: null,
    junitGlob: null,
    artifactGlob: null,
    baseUrl: null
  }, config);
  opts = Object.assign({ junitDir: null }, opts);

  if (config.src !== null && typeof config.src !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'src must be a string pointing to the backstop configuration file, or null');
  }
  if (config.junitGlob && typeof config.junitGlob !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'junitGlob must be a string glob, or null');
  }
  if (config.artifactGlob && typeof config.artifactGlob !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'artifactGlob must be a string glob, or null');
  }
  if (config.baseUrl && typeof config.baseUrl !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'baseUrl must be a string');
  }
  // @todo: Think through validation and handling of baseUrl and potentially
  // other environment variables.

  function testBackstop(done) {
    if (!config.src || config.src.length === 0) {
      return done();
    }
    var dir = path.resolve(path.dirname(config.src));
    var filename = path.basename(config.src);
    var baseUrl = config.baseUrl;
    var image = 'docksal/backstopjs@sha256:26084eb458305ebff9117635b37a70822b5141acfacc2354050d7d1dd32e92db';
    var op = opts.rebase ? 'reference' : 'test';
    var cmd = 'docker run --rm';
    cmd += ' -v ' + dir + ':/src';
    // Add the uid so the reports get written as the user we're currently
    // running as.
    cmd += ' --user=' + process.getuid();
    cmd += ' -e BASE_URL=' + baseUrl;
    cmd += ' ' + image;
    cmd += ' ' + op;
    cmd += ' --config=' + filename;

    exec(cmd, function(err, stdout) {
      if (err) {
        // The default error Error: Command failed: docker run... is not useful.
        // Grab from stdout to get *something* useful.
        if (stdout && stdout.length) {
          err = new gutil.PluginError(PLUGIN_NAME, { message: stdout });
        }        else {
          err = new gutil.PluginError(PLUGIN_NAME, { error: err });
        }
      }

      var merged = merge();
      if (config.junitGlob && opts.junitDir) {
        merged.add(
          gulp.src(config.junitGlob)
            .pipe(gulp.dest(opts.junitDir))
        );
      }

      if (config.artifactGlob && opts.artifactDir) {
        merged.add(
          gulp.src(config.artifactGlob)
            .pipe(gulp.dest(opts.artifactDir))
        );
      }

      merged.on('error', function(streamErr) {
        // An error here should take precedence over any backstop error.  It
        // has to be fixed before we can give a real report.
        err = new gutil.PluginError(PLUGIN_NAME, { error: streamErr });
        done(err);
      });
      merged.on('end', function() {
        done(err);
      });

      if (merged.isEmpty()) {
        merged.end();
        done(err);
      } else {
        merged.resume();
      }
    });
  }
  testBackstop.displayName = 'test:backstopjs';
  testBackstop.description = 'Run BackstopJS tests.';
  testBackstop._config = config;
  testBackstop._opts = opts;
  testBackstop.options = {
    'artifact-dir': 'A directory to output the test report to.',
    'junit-dir': 'A directory to output a junit formatted report to.',
    'rebase': 'Regenerate the reference screenshots.',
  };
  return testBackstop;
};
