
var factory = require('../../lib/build/js');
var rimraf = require('rimraf');
var path = require('path');
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var outpath = path.join(__dirname, '../../out-fixtures');
var inpath = path.join(__dirname, '../../fixtures');

describe('Javascript build task', function() {
  beforeEach(rimraf.bind(null, outpath, {}));
  afterEach(rimraf.bind(null, outpath, {}));

  it('Should do nothing if it is called with an empty config', function() {
    var stream = factory()();
    expect(stream).to.be.an('undefined');
  });

  it('Should fail on an invalid config being passed', function() {
    expect(factory.bind(factory, '')).to.throw(Error, 'config must be an object');
    expect(factory.bind(null, {
      src: [],
      min: ''
    })).to.throw(Error, 'min must be a boolean');
    expect(factory.bind(null, {
      src: [],
      maps: {}
    })).to.throw(Error, 'maps must be a string or `false`');
    expect(factory.bind(null, {
      src: [],
      concat: {}
    })).to.throw(Error, 'concat must be a string or `false`');
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({
      src: [],
      dest: null,
      concat: false,
      min: true,
      maps: './'
    });
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

  it('Should copy source files', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      dest: outpath,
    })();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'fixture.js'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should generate a sourcemap', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      dest: outpath,
      maps: './',
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var compiledFile = file(path.join(outpath, 'fixture.js'));
      expect(compiledFile).to.exist;
      expect(compiledFile).to.contain('sourceMappingURL=fixture.js.map');
      expect(file(path.join(outpath, 'fixture.js.map'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should minify the file', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      dest: outpath,
      min: true,
    })();

    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'fixture.js'))).to.exist;
      expect(file(path.join(outpath, 'fixture.min.js'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should concatenate the file', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.{js,txt}'),
      dest: outpath,
      min: false,
      concat: 'concat.js',
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var concatFile = file(path.join(outpath, 'concat.js'));
      expect(concatFile).to.exist;
      expect(concatFile).to.contain('From fixture.txt');
      done();
    });
    stream.resume();
  });

  it('Should generate a sourcemap for a minified file', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      dest: outpath,
      maps: './',
      min: true,
    })();
    stream.on('error', done);
    stream.on('end', function() {
      var srcFile = file(path.join(outpath, 'fixture.js'));
      var minFile = file(path.join(outpath, 'fixture.min.js'));
      expect(srcFile).to.exist;
      expect(srcFile).to.contain('sourceMappingURL=fixture.js.map');
      expect(minFile).to.exist;
      expect(minFile).to.contain('sourceMappingURL=fixture.min.js.map');
      done();
    });
    stream.resume();
  });
});
