'use strict';

var spawn = require('child-process-promise').spawn;

module.exports = function () {
  function installComposer() {
    return spawn('composer', ['install'], {
      stdio: ['inherit', 'inherit', 'inherit']
    });
  }
  installComposer.description = 'Install Composer dependencies.';
  installComposer.options = {};
  installComposer.schema = {};
  return installComposer;
};
