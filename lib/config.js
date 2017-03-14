
function adaptConfig(config) {
  var version = config.version ? parseInt(config.version) : 1;

  switch(version) {
    case 1:
      return adaptV1Config(config);
    default:
      throw new Error('Invalid config version: ' + version);
  }

  return Object.assign({}, config);
}
function adaptV1Config(input) {
  var config = {
    install: {bower: {}, composer: {}},
    check: {phpcs: {}, phplint: {}, eslint: {}},
    test: {behat: {}, backstopjs: {}, phantomas: {}},
    build: {scss: {}, js: {}, copy: {}}
  };

  if(input.hasOwnProperty('bowerJsonDirectory')) {
    config.install.bower.src = input.bowerJsonDirectory;
  }
  if(input.hasOwnProperty('phpCheck')) {
    config.check.phpcs.src = input.phpCheck;
    config.check.phplint.src = input.phpCheck;
  }
  if(input.hasOwnProperty('phpcsStandard')) {
    config.check.phpcs.standard = input.phpcsStandard;
  }
  if(input.hasOwnProperty('jsCheck')) {
    config.check.eslint.src = input.jsCheck;
  }

  if(input.hasOwnProperty('behatFiles')) {
    config.test.behat.src = input.behatFiles;
  }

  if(input.hasOwnProperty('backstopjs')) {
    config.test.backstopjs = input.backstopjs;
  }

  if(input.hasOwnProperty('phantomas')) {
    config.test.phantomas = input.phantomas;
  }

  if(input.hasOwnProperty('baseUrl')) {
    config.test.backstopjs.baseUrl = input.baseUrl;
    config.test.phantomas.baseUrl = input.baseUrl;
  }

  if(input.hasOwnProperty('scss')) {
    config.build.scss = input.scss;
  }
  if(input.hasOwnProperty('js')) {
    config.build.js = input.js;
  }
  if(input.hasOwnProperty('copy')) {
    config.build.copy = input.copy;
  }

  return config;
}

module.exports = {
  adapt: adaptConfig,
}
