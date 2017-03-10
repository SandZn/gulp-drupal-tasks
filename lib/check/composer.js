'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'lcm-check-composer-task';

module.exports = function (config, opts) {
  if (typeof config !== 'object' && typeof config !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid config: ' + typeof config);
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new PluginError(PLUGIN_NAME, 'Invalid opts: ' + typeof opts);
  }
  config = Object.assign({ src: '.' }, config || {});
  if (!fs.existsSync(config.src)) {
    throw new PluginError(PLUGIN_NAME, {
      message: 'Directory does not exist: ' + config.src
    });
  }

  function checkComposer(cb) {
    var execOpts = { cwd: config.src };
    exec('composer validate', execOpts, function(err, stderr, stdout) {
      if (err) {
        return cb(new PluginError(PLUGIN_NAME, {
          message: err.message
        }));
      }
      cb();
    });
  }
  checkComposer._config = config;
  checkComposer._opts = opts;
  checkComposer.displayName = 'check:composer';
  checkComposer.description = 'Check composer.json syntax.';
  checkComposer.options = {};
  return checkComposer;
};
