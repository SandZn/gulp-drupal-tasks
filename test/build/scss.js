var factory = require('../../lib/build/scss');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');
var PluginError = require('gulp-util').PluginError;

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var outpath = path.join(__dirname, '../../out-fixtures');
var inpath = path.join(__dirname, '../../fixtures');

describe('SCSS Task', function() {
  beforeEach(rimraf.bind(null, outpath, {}));
  afterEach(rimraf.bind(null, outpath, {}));

  it('Should do nothing if it is called with an empty config', function() {
    var stream = factory()();
    expect(stream).to.be.an('object');
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({
      src: [],
      dest: null,
      maps: false,
      prefix: {},
      sassOptions: {}
    });
    expect(task._opts).to.eql(undefined);
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should fail when called with invalid config', function() {
    expect(factory.bind(null, {
      src: [],
      maps: {}
    })).to.throw(PluginError);
    expect(factory.bind(null, {
      src: [],
      prefix: '',
    })).to.throw(PluginError);
    expect(factory.bind(null, {
      src: [],
      sassOptions: ''
    })).to.throw(PluginError);
  });

  it('Should build SCSS files', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.scss'),
      dest: outpath
    })();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'fixture.css'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should generate a sourcemap', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.scss'),
      dest: outpath,
      maps: './'
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var cssFile = file(path.join(outpath, 'fixture.css'));
      var mapFile = file(path.join(outpath, 'fixture.css.map'));
      expect(cssFile).to.contain('sourceMappingURL=fixture.css.map');
      expect(mapFile).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should prefix properties', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.scss'),
      dest: outpath,
      prefix: { browsers: ['last 4 versions'] }
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var cssFile = file(path.join(outpath, 'fixture.css'));
      expect(cssFile).to.contain('-ms-flex-preferred-size');
      done();
    });
    stream.resume();
  });

  it('Should use CSS optimizer', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.scss'),
      dest: outpath
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var cssFile = file(path.join(outpath, 'fixture.css'));
      expect(cssFile).to.contain('a,body{color:#000}');
      done();
    });
    stream.resume();
  });
});
