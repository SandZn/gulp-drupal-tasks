'use strict';

var gutil = require('gulp-util');
var exec = require('child_process').exec;
var gulp = require('gulp');
var which = require('which');
var validator = require('../validator');
var through = require('through2');
var gutil = require('gulp-util');
var omit = require('lodash.omit');

module.exports = function (config) {
  config = config || {};

  function testPhantomas() {
    validator(testPhantomas.schema, config);
    var phantomasOpts = omit(config, ['src']);

    return gulp.src(config.src)
      .pipe(phantomas(phantomasOpts))
      .pipe(config.dest ? gulp.dest(config.dest) : gutil.noop());
  }

  testPhantomas.description = 'Run Phantomas performance tests.';
  testPhantomas.options = {};
  testPhantomas.schema = {
    type: 'object',
    properties: {
      bin: {type: 'string', default: './node_modules/.bin/phantomas'},
      src: {
        type: 'string',
        default: __dirname + '/../__fixtures/phantomas.yaml'
      },
      dest: {
        type: 'string',
      }
    }
  }
  return testPhantomas;
};

function phantomas(opts) {
  return through.obj(function(file, enc, cb) {
    if(file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
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
      if(err) return cb(err, file);
      cb(null, file);
    });
  });
}
