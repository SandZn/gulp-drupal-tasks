
var factory = require('../../lib/install/composer');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');
var PluginError = require('gulp-util').PluginError;

chai.use(chaiFiles);
var expect = chai.expect;
var dir = chaiFiles.dir;

var inpath = path.join(__dirname, '../../fixtures');
var outpath = path.join(__dirname, '../../fixtures/vendor');

describe('Composer task', function() {
  afterEach(rimraf.bind(null, outpath, {}));
  beforeEach(rimraf.bind(null, outpath, {}));

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

  it('Should install composer dependencies', function(done) {
    // Use the invalid composer that does not have a name property,
    // because it skips a lot of network calls that way.
    var task = factory({
      src: inpath + '/composer.json'
    }, { silent: true });

    var stream = task();
    stream.on('error', done);
    stream.on('end', function() {
      expect(dir(outpath)).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should allow passing a directory', function(done) {
    var task = factory({
      src: inpath
    }, { silent: true });
    var stream = task();
    stream.on('error', done);
    stream.on('end', function() {
      expect(dir(outpath)).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should fail if there is an error', function(done) {
    var task = factory({
      src: inpath + '/composer-corrupt.json',
    }, { silent: true });
    var stream = task();
    stream.on('error', function(err) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.contain('Exited with code 1');
      done();
    });
    stream.on('end', function() {
      done(new Error('Expected error to be thrown.'));
    });
    stream.resume();
  });

  it('Should fail for an invalid bin', function(done) {
    var task = factory({
      src: inpath + '/composer.json',
      bin: inpath + '/nonexistent',
    }, { silent: true });
    var stream = task();
    stream.on('error', function(err) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.contain('ENOENT');
      done();
    });
  });
});
