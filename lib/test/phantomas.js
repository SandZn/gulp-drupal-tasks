'use strict';

var exec = require('child_process').exec;
var gulp = require('gulp');
var which = require('which');
var through = require('through2');
var gutil = require('gulp-util');
var omit = require('lodash.omit');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'lcm-test-phantomas-task';

module.exports = function (config, opts) {
  if(typeof config !== 'object' && typeof config !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid config: ' + typeof config);
  }
  if(typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid opts: ' + typeof opts);
  }
  config = Object.assign({src: [], bin: './node_modules/.bin/phantomas'}, config);
  opts = Object.assign({}, opts);

  function testPhantomas() {
    var phantomasOpts = omit(config, ['src']);

    return gulp.src(config.src)
      .pipe(phantomas(phantomasOpts));
  }

  testPhantomas._config = config;
  testPhantomas._opts = opts;
  testPhantomas.displayName = 'test:phantomas';
  testPhantomas.description = 'Run Phantomas performance tests.';
  testPhantomas.options = {};
  return testPhantomas;
};

function phantomas(opts) {
  return through.obj(function(file, enc, cb) {
    if(file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var bin = opts.bin || which.sync('phantomas');
    exec(bin + ' --config=' + file.path, {}, function (err, stdout, stderr) {
      if(!opts.silent && stdout) {
        gutil.log(stdout);
      }
      if(!opts.silent && stderr) {
        gutil.log(stderr);
      }
      file.path = gutil.replaceExtension(file.path, '.txt');
      file.contents = new Buffer(stdout);
      if(err) {
        err = new PluginError(PLUGIN_NAME, {error: err});
      }
      cb(err, file);
    });
  });
}
