

function adaptV1Config(input) {
  var config = {
    build: {}
  };

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
