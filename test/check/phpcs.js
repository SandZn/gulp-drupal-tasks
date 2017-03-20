
var path = require('path');
var factory = require('../../lib/check/phpcs');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../fixtures');

describe('PHPCS Task', function() {

  it('Should do nothing if it is called with an empty config', function() {
    var stream = factory()();
    expect(stream).to.be.an('object');
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: [], bin: null, standard: null });
    expect(task._opts).to.eql({ silent: false });
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should fail for an invalid file', function(done) {
    var stream = factory({
      src: path.join(inpath, 'invalid.php')
    }, { silent: true })();
    stream.on('error', function(err) {
      expect(err).to.be.instanceOf(PluginError);
      expect(err.message).to.contain('PHP Code Sniffer failed');
      done();
    });
    stream.on('end', function() {
      done(new Error('Expected an error to be thrown'));
    });
    stream.resume();
  });

  it('Should pass for a valid file', function(done) {
    var stream = factory({
      src: path.join(inpath, 'valid.php'),
    })();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });
});
