/* eslint-disable max-statements */

var Helper = require('./helper');
var factories = require('./factories');

module.exports = function(gulp, config, opts) {
  var helper = new Helper(gulp);

  var config = Object.assign({ install: {}, check: {}, build: {}, test: {} }, config);

  if (config.install.composer) {
    helper.addDescribedTask(factories.install.composer(config.install.composer, opts));
  }
  if (config.install.bower) {
    helper.addDescribedTask(factories.install.bower(config.install.bower, opts));
  }

  if (config.check.composer) {
    helper.addDescribedTask(factories.check.composer(config.check.composer, opts));
  }
  if (config.check.phplint) {
    helper.addDescribedTask(factories.check.phplint(config.check.phplint, opts));
  }
  if (config.check.phpcs) {
    helper.addDescribedTask(factories.check.phpcs(config.check.phpcs, opts));
  }
  if (config.check.eslint) {
    helper.addDescribedTask(factories.check.eslint(config.check.eslint, opts));
  }

  if (config.build.scss) {
    helper.addSubtasks(factories.build.scss, config.build.scss, opts);
  }
  if (config.build.js) {
    helper.addSubtasks(factories.build.js, config.build.js, opts);
  }
  if (config.build.copy) {
    helper.addSubtasks(factories.build.copy, config.build.copy, opts);
  }

  if (config.test.behat) {
    helper.addDescribedTask(factories.test.behat(config.test.behat, opts));
  }
  if (config.test.backstopjs) {
    helper.addDescribedTask(factories.test.backstop(config.test.backstopjs, opts));
  }
  if (config.test.phantomas) {
    helper.addDescribedTask(factories.test.phantomas(config.test.phantomas, opts));
  }
  if (config.test.phpunit) {
    helper.addDescribedTask(factories.test.phpunit(config.test.phpunit, opts));
  }

  helper.addMetaTask('install', 'Run all install tasks.');
  helper.addMetaTask('build:scss', 'Build CSS from SCSS');
  helper.addMetaTask('build:js', 'Build JS files');
  helper.addMetaTask('build:copy', 'Copy source files and minify images');
  helper.addMetaTask('build', 'Run all build tasks.');
  helper.addMetaTask('check', 'Run all check tasks.');
  helper.addMetaTask('test', 'Run all test steps.');

  var buildWatch = factories.watch(gulp, 'build', opts, 'Build and watch assets for changes');
  helper.addDescribedTask(buildWatch, buildWatch._watched);
};

