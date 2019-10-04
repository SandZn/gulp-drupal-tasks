'use strict';

const configAdapter = require('./lib/config');
const Registry = require('./lib');

module.exports = class extends Registry {
  constructor(config) {
    super(configAdapter(config));
  }
};

