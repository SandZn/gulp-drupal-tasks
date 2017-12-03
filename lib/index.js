/* eslint-disable max-statements */

var Helper = require('./helper');
var factories = require('./factories');

module.exports = function(gulp, config, opts) {
  var helper = new Helper(gulp);

  var config = Object.assign({ build: {} }, config);

  if (config.build.scss) {
    helper.addSubtasks(factories.build.scss, config.build.scss, opts);
  }
  if (config.build.js) {
    helper.addSubtasks(factories.build.js, config.build.js, opts);
  }
  if (config.build.copy) {
    helper.addSubtasks(factories.build.copy, config.build.copy, opts);
  }

  helper.addMetaTask('build:scss', 'Build CSS from SCSS');
  helper.addMetaTask('build:js', 'Build JS files');
  helper.addMetaTask('build:copy', 'Copy source files and minify images');
  helper.addMetaTask('build', 'Run all build tasks.', true);

  var buildWatch = factories.watch(gulp, 'build', opts, 'Build and watch assets for changes');
  if (buildWatch._watched.length) {
    helper.addDescribedTask(buildWatch, buildWatch._watched);
  }
  var watch = factories.watch(gulp, '', opts, 'Build, check and watch files for changes');
  if (watch._watched.length) {
    helper.addDescribedTask(watch, watch._watched);
  }
};

