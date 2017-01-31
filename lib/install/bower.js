'use strict';

var spawn = require('child-process-promise').spawn;
var validate = require('../validator');

module.exports = function (config) {
  function installBower() {
    validate(installBower.schema, config);
    return config.bowerJsonDirectory
      ? spawn('bower', ['install', '--allow-root'], {
          stdio: ['inherit', 'inherit', 'inherit'],
          cwd: config.bowerJsonDirectory,
        })
      : new Promise(function(resolve) {
        resolve(null);
      });
  }
  installBower.prototype.description = 'Install Bower dependencies.';
  installBower.description = 'Install Bower dependencies.';
  installBower.options = {};
  installBower.schema = {
    type: 'object',
    properties: {
      bowerJsonDirectory: {
        type: 'string'
      }
    }
  };
  return installBower;
};
