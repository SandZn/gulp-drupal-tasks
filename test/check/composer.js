
var path = require('path');
var factory = require('../../lib/check/composer');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../fixtures');

describe('Composer Validate Task', function() {

  it('Should should fall back to a default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: '.' });
    var task = factory({});
    expect(task._config).to.eql({ src: '.' });
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError);
    expect(factory.bind(factory, {}, '')).to.throw(PluginError);
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run composer validate', function(done) {
    var task = factory({
      src: inpath
    });

    task(function(err) {
      expect(err).to.be.instanceof(PluginError);
      expect(err.message).to.contain('composer.json is valid for simple usage with composer');
      done();
    });
  });
});
