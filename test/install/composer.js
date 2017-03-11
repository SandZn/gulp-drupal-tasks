
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
    expect(task._config).to.eql({ src: './composer.json' });
    var task = factory({});
    expect(task._config).to.eql({ src: './composer.json' });
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
    expect(factory.bind(null, {
      src: {}
    })).to.throw(PluginError, 'src must be a string');
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
      src: inpath + '/composer-invalid.json',
      quiet: true
    });

    task(function() {
      expect(dir(outpath)).to.exist;
      done();
    });
  });

  it('Should fail if there is an error', function(done) {
    var task = factory({ src: path.join(inpath, 'nonexistent') });
    task(function(err) {
      expect(err).to.be.an.instanceof(PluginError);
      done();
    });
  });
});
