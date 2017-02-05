'use strict';

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var validator = require('../validator');
var PluginError = require('gulp-util').PluginError;

module.exports = function (config) {
  config = config || {};

  function checkComposer(cb) {
    validator(checkComposer.schema, config);

    exec('composer validate --working-dir=' + config.src, {}, function(err, stderr, stdout) {
      if(err) {
        return cb(new PluginError('gulp-composer-validate', {
          message: err.message
        }));
      }
      cb();
    });
  }
  checkComposer.description = 'Check composer.json syntax.';
  checkComposer.options = {};
  checkComposer.schema = {
    type: 'object',
    properties: {
      src: {
        type: 'string',
        default: '.',
      }
    }
  }
  return checkComposer;
};
