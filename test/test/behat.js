
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
    var configs = [undefined, {}];
    configs.forEach(function(config) {
      var task = factory(config);
      expect(task._config).to.eql({ bin: '', baseUrl: undefined, suite: undefined });
      expect(task._opts).to.eql({ junitDir: null, silent: false });
    });
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
  });

  var invalidConfigTests = {
    'Should fail on an invalid src': {
      config: {src: {}},
      message: 'src must be a string',
    },
    'Should fail on an invalid suite': {
      config: {suite: {}},
      message: 'suite must be a string',
    }
  };

  for(t in invalidConfigTests) {
    it(t, function() {
      expect(factory.bind(factory, invalidConfigTests[t].config, invalidConfigTests[t].opts)).to.throw(PluginError, invalidConfigTests[t].message);
    })
  }

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run behat', function(done) {
    var stream = factory({
      src: path.join(inpath, 'behat.yml'),
      bin: behatBin,
      suite: 'passing'
    }, { silent: true })();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Should throw an error on behat failures', function(done) {
    var stream = factory({
      src: path.join(inpath, 'behat.yml'),
      bin: behatBin,
      suite: 'failing'
    }, { silent: true })();
    stream.on('error', function() {
      done();
    });
    stream.on('end', function() {
      throw new Error('Task did not fail.');
    });
    stream.resume();
  });
});
