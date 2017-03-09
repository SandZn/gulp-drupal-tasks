'use strict';

var exec = require('child_process').exec;
var gulp = require('gulp');
var which = require('which');
var through = require('through2');
var gutil = require('gulp-util');
var omit = require('lodash.omit');

module.exports = function (config, opts) {
  config = Object.assign({src: [], bin: './node_modules/.bin/phantomas'}, config);
  opts = Object.assign({}, opts);

  function testPhantomas() {
    var phantomasOpts = omit(config, ['src', 'dest']);

    return gulp.src(config.src)
      .pipe(phantomas(phantomasOpts));
  }

  testPhantomas._config = config;
  testPhantomas._opts = opts;
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
      if(err) {
        err = new gutil.PluginError('gulp-phantomas', {error: err});
      }
      cb(err, file);
    });
  });
}
