'use strict';

var spawn = require('child-process-promise').spawn;

module.exports = function () {
  function checkComposer() {
    return spawn('composer', ['validate'], {
      stdio: ['inherit', 'inherit', 'inherit']
    });
  }
  checkComposer.description = 'Check composer.json syntax.';
  checkComposer.options = {};
  return checkComposer;
};
