

function adaptV1Config(input) {
  var config = {
    install: {},
    check: {},
    test: {},
    build: {}
  };


  if (input.bower) {
    config.install.bower = input.bower;
  }
  if (input.composer) {
    config.install.composer = input.composer;
    config.check.composer = input.composer;
  }
  if (input.phpcs) {
    config.check.phpcs = input.phpcs;
  }
  if (input.phplint) {
    config.check.phplint = input.phplint;
  }
  if (input.eslint) {
    config.check.eslint = input.eslint;
  }
  if (input.phpunit) {
    config.test.phpunit = input.phpunit;
  }
  if (input.behat) {
    config.test.behat = input.behat;
  }
  if (input.backstopjs) {
    config.test.backstopjs = input.backstopjs;
  }
  if (input.phantomas) {
    config.test.phantomas = input.phantomas;
  }
  if (input.scss) {
    config.build.scss = input.scss;
  }
  if (input.js) {
    config.build.js = input.js;
  }
  if (input.copy) {
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
