
var factory = require('../js');
var rimraf = require('rimraf');
var path = require('path');
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var outpath = path.join(__dirname, '../../__out-fixtures');
var inpath = path.join(__dirname, '../../__fixtures');

describe('Javascript build task', function() {
  beforeEach(rimraf.bind(null, outpath));
  afterEach(rimraf.bind(null, outpath));

  it('Should require src', function() {
    expect(factory({ dest: 'bar' })).to.throw('config should have required property \'src\'');
  });

  it('Should require dest', function() {
    expect(factory({ src: 'foo' })).to.throw('config should have required property \'dest\'');
  });

  it('Should copy source files', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      dest: outpath,
    })();
    stream.on('error', done.fail);
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
    stream.on('error', done.fail);
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
      concat: 'concat.js',
    })();
    stream.on('error', done.fail);
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
    stream.on('error', done.fail);
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
