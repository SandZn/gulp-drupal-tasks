var factory = require('../../lib/build/scss');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');

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
    expect(stream).to.be.an('undefined');
  });

  it('Should fail on an invalid config being passed', function() {
    expect(factory.bind(factory, '')).to.throw(Error, 'config must be an object');
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({
      src: [],
      dest: null,
      concat: false,
      min: true,
      maps: './',
      prefix: { browsersList: 'last 2 versions' },
      sassOptions: {}
    });
    expect(task._opts).to.eql(undefined);
  });

  it('Should not modify the config object', function() {
    var cfg = Object.freeze({});
    factory(cfg);
  });

  it('Should add a _watch property if src is not empty', function() {
    var cfg = { src: 'foo' };
    var task = factory(cfg);
    expect(task._watch).to.eql('foo');
  });

  it('Should not add a _watch property if src is empty', function() {
    var task = factory();
    expect(task._watch).to.be.null;
  });

  it('Should fail when called with invalid config', function() {
    expect(factory.bind(null, {
      src: [],
      maps: {}
    })).to.throw(Error);
    expect(factory.bind(null, {
      src: [],
      prefix: '',
    })).to.throw(Error);
    expect(factory.bind(null, {
      src: [],
      sassOptions: ''
    })).to.throw(Error);
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

  it('Should concatenate files', function(done) {
    var stream = factory({
      src: path.join(inpath, '*.scss'),
      concat: 'libs.css',
      dest: outpath
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var fixtureFile = file(path.join(outpath, 'fixture.css'));
      var libsFile = file(path.join(outpath, 'libs.css'));
      expect(fixtureFile).not.to.exist;
      expect(libsFile).to.exist;
      expect(libsFile).to.contain('.fixture1{');
      expect(libsFile).to.contain('.fixture2{');
      done();
    });
  });

  it('Should prefix properties', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.scss'),
      dest: outpath
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var cssFile = file(path.join(outpath, 'fixture.css'));
      expect(cssFile).to.contain('-ms-user-select');
      done();
    });
    stream.resume();
  });

  it('Should not prefix properties if prefix is false', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.scss'),
      dest: outpath,
      prefix: false
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var cssFile = file(path.join(outpath, 'fixture.css'));
      expect(cssFile).not.to.contain('-ms-user-select');
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

  it('Should import tilde paths', function (done) {
    var stream = factory({
      src: path.join(inpath, 'fixture-import.scss'),
      dest: outpath
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var cssFile = file(path.join(outpath, 'fixture-import.css'));
      expect(cssFile).to.contain('#navbar');
      done();
    });
  });
});
