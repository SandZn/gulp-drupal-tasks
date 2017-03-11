
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
    expect(task._config).to.eql({ src: '.' });
    var task = factory({});
    expect(task._config).to.eql({ src: '.' });
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError);
    expect(factory.bind(factory, {}, '')).to.throw(PluginError);
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should install bower dependencies', function(done) {
    var task = factory({ src: inpath });
    task(function() {
      expect(dir(outpath)).to.exist;
      done();
    });
  });
});
