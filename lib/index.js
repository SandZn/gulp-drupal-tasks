
var factories = { install: {}, check: {}, test: {}, build: {} };
factories.install.composer = require('./install/composer');
factories.install.bower = require('./install/bower');

factories.check.composer = require('./check/composer');
factories.check.phplint = require('./check/phplint');
factories.check.phpcs = require('./check/phpcs');
factories.check.eslint = require('./check/eslint');

factories.test.behat = require('./test/behat');
factories.test.backstop = require('./test/backstop');
factories.test.phantomas = require('./test/phantomas');

factories.build.scss = require('./build/scss');
factories.build.js = require('./build/js');
factories.build.copy = require('./build/copy');

module.exports = factories;
