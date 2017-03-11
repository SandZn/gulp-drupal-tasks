
var path = require('path');
var factory = require('../eslint');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../__fixtures');

describe('ESLint Task', function() {

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
    expect(task._config).to.eql({ src: [] });
    expect(task._opts).to.eql(undefined);
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run ESLint checks on matching files', function(done) {
    var outStream = function() {};
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      ignore: false,
      logOutput: outStream
    })();

    stream.on('error', function(err) {
      expect(err).to.be.instanceOf(PluginError);
      expect(err.message).to.equal('Failed with 1 error');
      done();
    });
    stream.on('end', function() {
      done(new Error('Expected an error to be thrown'));
    })
    stream.resume();
  });

  it('Should allow an array of globs', function(done) {
    var stream = factory({
      src: [
        path.join(inpath, '*.nonexistent'),
        path.join(inpath, '*.stillnonexistent')
      ]
    })();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Passes configuration options through to eslint', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      rules: { 'no-extend-native': 0 },
    })();

    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });
});
