'use strict';

var exec = require('child_process').exec;
var validator = require('../validator');
var PluginError = require('gulp-util').PluginError;

module.exports = function (config) {
  config = config || {};

  function installComposer(done) {
    validator(installComposer.schema, config);

    exec('composer install -q --working-dir=' + config.src, function(err, stdout, stderr) {
      if(err) {
        return done(new PluginError('gulp-composer-install', {
          message: err.message
        }));
      }
      done();
    });
  }
  installComposer.description = 'Install Composer dependencies.';
  installComposer.options = {};
  installComposer.schema = {
    type: 'object',
    properties: {
      src: {
        type: 'string',
        default: '.',
      }
    }
  };
  return installComposer;
};
