'use strict';

var exec = require('child_process').exec;
var validate = require('../validator');
var PluginError = require('gulp-util').PluginError;

module.exports = function (config) {
  function installBower(done) {
    validate(installBower.schema, config);

    var opts = { cwd: config.src };
    exec('bower install --allow-root', opts, function(err, stderr, stdout) {
      if(err) {
        return done(new PluginError('gulp-composer-install', {
          message: err.message
        }));
      }
      done();
    });
  }
  installBower.prototype.description = 'Install Bower dependencies.';
  installBower.description = 'Install Bower dependencies.';
  installBower.options = {};
  installBower.schema = {
    type: 'object',
    properties: {
      src: {
        type: 'string',
        default: '.',
      }
    }
  };
  return installBower;
};
