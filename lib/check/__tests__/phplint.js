
var path = require('path');
var factory = require('../phplint');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../__fixtures');

describe('PHPLint Task', function() {

  it('Should do nothing if it is called with an empty config', function() {
    var stream = factory()();
    expect(stream).to.be.an('object');
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError);
    expect(factory.bind(factory, {}, '')).to.throw(PluginError);
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

  it('Should check file globs', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.php')
    })();
    stream.on('error', function(err) {
      expect(err).to.be.instanceOf(PluginError);
      expect(err.message).to.contain('syntax error, unexpected');
      done();
    });
    stream.on('end', done.fail.bind(null, new Error('Expected an error to be thrown')));
    stream.resume();
  });
});
