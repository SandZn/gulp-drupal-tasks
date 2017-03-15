
var factory = require('../../lib/install/bower');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');
var PluginError = require('gulp-util').PluginError;

chai.use(chaiFiles);
var expect = chai.expect;
var dir = chaiFiles.dir;

var outpath = path.join(__dirname, '../../fixtures/bower_components');
var inpath = path.join(__dirname, '../../fixtures');

describe('Bower task', function() {
  afterEach(rimraf.bind(null, outpath, {}));
  beforeEach(rimraf.bind(null, outpath, {}));

  it('Should should fall back to a default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: [] });
    var task = factory({});
    expect(task._config).to.eql({ src: [] });
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

  it('Should do nothing if passed an empty src', function() {
    var stream = factory()();
    expect(stream).to.be.an('object');
  });

  it('Should install bower dependencies', function(done) {
    var stream = factory({ src: inpath })();
    stream.on('error', done);
    stream.on('end', function() {
      expect(dir(outpath)).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should fail bower install if there is an error', function(done) {
    var stream = factory({ src: path.join(inpath, 'bad_package') })();
    stream.on('error', function(err) {
      expect(err).to.be.instanceOf(PluginError);
      expect(err.message).to.contain('Unexpected token t in JSON');
      done();
    });
    stream.on('end', function() {
      done(new Error('Task did not fail'));
    });
    stream.resume();

  });
});
