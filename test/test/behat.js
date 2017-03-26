
var path = require('path');
var factory = require('../../lib/test/behat');
var PluginError = require('gulp-util').PluginError;
var rimraf = require('rimraf');

var chai = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var inpath = path.join(__dirname, '../../fixtures');
var outpath = path.join(__dirname, '../../out-fixtures');

describe('Behat Task', function() {
  beforeEach(rimraf.bind(null, outpath, {}));
  afterEach(rimraf.bind(null, outpath, {}));

  it('Should use the default config', function() {
    var configs = [undefined, {}];
    configs.forEach(function(config) {
      var task = factory(config);
      expect(task._config).to.eql({ bin: '', baseUrl: undefined, suite: undefined });
      expect(task._opts).to.eql({ junitDir: null, silent: false, baseUrl: null });
    });
  });

  var invalidConfigTests = [
    { it: 'Should fail on invalid config', config: '', message: 'config must be an object' },
    { it: 'Should fail on invalid opts', opts: '', message: 'opts must be an object' },
    { it: 'Should fail on an invalid bin', config: { bin: {} }, message: 'bin must be a string' },
    { it: 'Should fail on an invalid src', config: { src: {} }, message: 'src must be a string' },
    { it: 'Should fail on an invalid baseurl', config: { baseUrl: {} }, message: 'baseUrl must be a string' },
    { it: 'Should fail on an invalid baseurl from opts', opts: { baseUrl: {} }, message: 'baseUrl must be a string' },
    { it: 'Should fail on an invalid suite', config: { suite: {} }, message: 'suite must be a string' },
    { it: 'Should fail on an invalid junitDir', opts: { junitDir: {}, message: 'junitDir must be a string' } },
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

  it('Should run behat', function(done) {
    var stream = factory({
      src: path.join(inpath, 'behat.yml'),
      suite: 'passing'
    }, { silent: true })();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Should throw an error on an invalid phpunit bin', function(done) {
    var stream = factory({
      src: path.join(inpath, 'phpunit.xml.dist'),
      bin: '/some/nonexistent/path',
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

  it('Should throw an error on behat failures', function(done) {
    var stream = factory({
      src: path.join(inpath, 'behat.yml'),
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

  it('Should output a junit file', function(done) {
    var stream = factory({
      src: path.join(inpath, 'behat.yml'),
      suite: 'passing'
    }, {
      silent: true,
      junitDir: outpath,
    })();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'behat', 'passing.xml'))).to.exist;
      done();
    });
    stream.resume();
  });
});
