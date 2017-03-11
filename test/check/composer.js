
var path = require('path');
var factory = require('../../lib/check/composer');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../fixtures');

describe('Composer Validate Task', function() {

  it('Should should fall back to a default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: './composer.json' });
    var task = factory({});
    expect(task._config).to.eql({ src: './composer.json' });
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
    expect(factory.bind(factory, {
      src: {}
    })).to.throw(PluginError, 'src must be a string');
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should pass composer validate for a valid composer file', function(done) {
    var task = factory({
      src: inpath + '/composer-valid.json'
    });
    task(done);
  });

  it('Should fail composer validate for an invalid composer file', function(done) {
    var task = factory({
      src: inpath + '/composer-invalid.json'
    });

    task(function(err) {
      expect(err).to.be.instanceof(PluginError);
      expect(err.message).to.contain('is valid for simple usage with composer');
      done();
    });
  });
});
