
var path = require('path');
var factory = require('../../lib/check/composer');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../fixtures');

describe('Composer Validate Task', function() {

  it('Should should fall back to a default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: './composer.json', bin: null });
    var task = factory({});
    expect(task._config).to.eql({ src: './composer.json', bin: null });
  });

  var invalidConfigTests = [
    { it: 'Should fail on invalid config', config: '', message: 'config must be an object' },
    { it: 'Should fail on invalid opts', opts: '', message: 'opts must be an object' },
    { it: 'Should fail on an invalid src', config: { src: {} }, message: 'src must be a gulp glob' },
    { it: 'Should fail on an invalid bin', config: { bin: {} }, message: 'bin must be a string' },
  ];

  invalidConfigTests.forEach(function(test) {
    it(test.it, function() {
      expect(factory.bind(null, test.config, test.opts)).to.throw(PluginError, test.message);
    });
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should pass composer validate for a valid composer file', function(done) {
    var task = factory({
      src: inpath + '/composer-valid.json'
    }, { silent: true });
    var stream = task();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Should fail composer validate for an invalid composer file', function(done) {
    var task = factory({
      src: inpath + '/composer.json'
    }, { silent: true });

    var stream = task();
    stream.on('error', function(err) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.contain('Exited with code 2');
      done();
    });
    stream.on('done', function() {
      done(new Error('Expected error to be thrown.'));
    });
    stream.resume();
  });

  it('Should allow passing a directory as a src', function(done) {
    var task = factory({
      src: inpath // This is the invalid composer.json
    }, { silent: true });
    var stream = task();
    stream.on('error', function(err) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.contain('Exited with code 2');
      done();
    });
    stream.on('done', function() {
      done(new Error('Expected error to be thrown.'));
    });
    stream.resume();
  });

  it('Should fail on an invalid composer bin', function(done) {
    var task = factory({
      src: inpath + '/composer-valid.json',
      bin: '/some/nonexistent/path',
    }, { silent: true });
    var stream = task();
    stream.on('error', function() {
      done();
    });
    stream.on('done', function() {
      done(new Error('Expected error to be thrown.'));
    });
    stream.resume();
  });
});
