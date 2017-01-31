'use strict';
var tasks = { install: {}, check: {}, test: {}, build: {} };
tasks.install.composer = require('./lib/install/composer');
tasks.install.bower = require('./lib/install/bower');

tasks.check.composer = require('./lib/check/composer');
tasks.check.phplint = require('./lib/check/phplint');
tasks.check.phpcs = require('./lib/check/phpcs');
tasks.check.eslint = require('./lib/check/eslint');

tasks.test.behat = require('./lib/test/behat');
tasks.test.backstop = require('./lib/test/backstop');
tasks.test.phantomas = require('./lib/test/phantomas');

tasks.build.scss = require('./lib/build/scss');
tasks.build.js = require('./lib/build/js');
tasks.build.copy = require('./lib/build/copy');

module.exports = function (config, opts) {
  return {
    install: {
      composer: tasks.install.composer(config, opts),
      bower: tasks.install.bower(config, opts)
    },
    check: {
      composer: tasks.check.composer(config, opts),
      phplint: tasks.check.phplint(config, opts),
      phpcs: tasks.check.phpcs(config, opts),
      eslint: tasks.check.eslint(config, opts)
    },
    test: {
      behat: tasks.test.behat(config, opts),
      backstop: tasks.test.backstop(config, opts),
      phantomas: tasks.test.phantomas(config, opts)
    },
    build: {
      scss: tasks.build.scss(config, opts),
      js: tasks.build.js(config, opts),
      copy: tasks.build.copy(config, opts)
    }
  };
};
