'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');

var PLUGIN_NAME = 'lcm-bower-install-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'config must be an object');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  // Clone config.
  config = Object.assign({ src: [] }, config || {});
  opts = Object.assign({ silent: false }, opts || {});

  function installBower() {
    return gulp.src(config.src)
      .pipe(bower({
        silent: opts.silent
      }));
  }
  installBower._config = config;
  installBower._opts = opts;
  installBower.displayName = 'install:bower';
  installBower.description = 'Install Bower dependencies.';
  installBower.options = {};
  return installBower;
};

function bower(opts) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull() && !file.isDirectory()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var bowerOpts = {
      cwd: file.isDirectory() ? file.path : path.dirname(file.path)
    };
    var bowerObj = require('bower');
    var installCommand = bowerObj.commands.install([], {}, bowerOpts);
    var renderer = require('bower/lib/util/cli').getRenderer('install', false, bowerOpts);

    installCommand.on('log', function(msg) {
      if (!opts.silent) {
        renderer.log(msg);
      }
    });
    installCommand.on('error', function(err) {
      if (!opts.silent) {
        renderer.error(err);
      }
      cb(err);
    });
    installCommand.on('end', function(a) {
      if (!opts.silent) {
        renderer.end(a);
      }
      cb(null, file);
    });
  });
}
