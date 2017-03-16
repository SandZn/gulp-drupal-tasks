
var path = require('path');
var factory = require('../../lib/check/phplint');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../fixtures');

describe('PHPLint Task', function() {

  it('Should do nothing if it is called with an empty config', function(done) {
    factory()(done);
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: [], bin: '' });
    expect(task._opts).to.eql(undefined);
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should pass valid files', function(done) {
    var task = factory({
      src: path.join(inpath, 'valid.php')
    });
    task(done);
  });

  it('Should fail invalid files', function(done) {
    var task = factory({
      src: path.join(inpath, 'invalid.php')
    });
    task(function(err) {
      expect(err).to.be.instanceOf(Error);
      expect(err.message).to.contain('syntax error, unexpected');
      done();
    });
  });
});
