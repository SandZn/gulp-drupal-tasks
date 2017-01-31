
var Ajv = require('ajv');

module.exports = function(schema, config) {
  var ajv = new Ajv({ useDefaults: true });
  if (!ajv.validate(schema, config)) {
    throw new Error(ajv.errorsText(undefined, { dataVar: 'config' }));
  }
  return true;
};
