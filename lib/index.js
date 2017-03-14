
var Helper = require('./helper');
var factories = require('./factories');

module.exports = function(gulp, config, opts) {
  var helper = new Helper(gulp);

  var config = Object.assign({ install: {}, check: {}, build: {}, test: {} }, config);

  helper.addDescribedTask(factories.install.composer(config.install.composer, opts));
  helper.addDescribedTask(factories.install.bower(config.install.bower, opts));

  helper.addDescribedTask(factories.check.composer(config.check.composer, opts));
  helper.addDescribedTask(factories.check.phplint(config.check.phplint, opts));
  helper.addDescribedTask(factories.check.phpcs(config.check.phpcs, opts));
  helper.addDescribedTask(factories.check.eslint(config.check.eslint, opts));

  helper.addSubtasks(factories.build.scss, config.build.scss, opts);
  helper.addSubtasks(factories.build.js, config.build.js, opts);
  helper.addSubtasks(factories.build.copy, config.build.copy, opts);


  helper.addDescribedTask(factories.test.behat(config.test.behat, opts));
  helper.addDescribedTask(factories.test.backstop(config.test.backstopjs, opts));
  helper.addDescribedTask(factories.test.phantomas(config.test.phantomas, opts));

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

