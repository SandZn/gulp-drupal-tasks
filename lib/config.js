
function adaptV1Config(input) {
  var config = {
    install: { bower: {}, composer: {} },
    check: { phpcs: {}, phplint: {}, eslint: {} },
    test: { behat: {}, backstopjs: {}, phantomas: {} },
    build: { scss: {}, js: {}, copy: {} }
  };

  if (input.hasOwnProperty('bowerJsonDirectory')) {
    config.install.bower.src = input.bowerJsonDirectory;
  }
  if (input.hasOwnProperty('phpCheck')) {
    config.check.phpcs.src = input.phpCheck;
    config.check.phplint.src = input.phpCheck;
  }
  if (input.hasOwnProperty('phpcsStandard')) {
    config.check.phpcs.standard = input.phpcsStandard;
  }
  if (input.hasOwnProperty('jsCheck')) {
    config.check.eslint.src = input.jsCheck;
  }

  if (input.hasOwnProperty('behatFiles')) {
    config.test.behat.src = input.behatFiles;
  }

  if (input.hasOwnProperty('backstopjs')) {
    config.test.backstopjs = input.backstopjs;
  }

  if (input.hasOwnProperty('phantomas')) {
    config.test.phantomas = input.phantomas;
  }

  if (input.hasOwnProperty('baseUrl')) {
    config.test.backstopjs.baseUrl = input.baseUrl;
    config.test.phantomas.baseUrl = input.baseUrl;
  }

  if (input.hasOwnProperty('scss')) {
    config.build.scss = input.scss;
  }
  if (input.hasOwnProperty('js')) {
    config.build.js = input.js;
  }
  if (input.hasOwnProperty('copy')) {
    config.build.copy = input.copy;
  }

  return config;
}

module.exports = function adaptConfig(input) {
  var version = input.version ? parseInt(input.version) : 1;
  var config = {};

  switch (version) {
    case 1:
      config = adaptV1Config(input);
      break;
    default:
      throw new Error('Invalid config version: ' + version);
  }

  config.version = version;
  return config;
};
