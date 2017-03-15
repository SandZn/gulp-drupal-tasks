
var path = require('path');
var factory = require('../../lib/test/behat');
var which = require('which');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../fixtures');

describe('Behat Task', function() {
  var behatBin;
  before(function(done) {
    which('behat', function(err, resolvedPath) {
      behatBin = resolvedPath;
      done(err);
    });
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({ bin: '' });
    expect(task._opts).to.eql({ junitDir: null });
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run behat', function(done) {
    var stream = factory({
      src: path.join(inpath, 'behat.yml'),
      bin: behatBin,
      suite: 'passing',
      silent: true,
    })();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Should throw an error on behat failures', function(done) {
    var stream = factory({
      src: path.join(inpath, 'behat.yml'),
      bin: behatBin,
      suite: 'failing',
      silent: true,
    })();
    stream.on('error', function() {
      done();
    });
    stream.on('end', function() {
      throw new Error('Task did not fail.');
    });
    stream.resume();
  });
});
