var factory = require('../scss');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var outpath = path.join(__dirname, '../../__out-fixtures');
var inpath = path.join(__dirname, '../../__fixtures');

describe('SCSS Task', function() {
  beforeEach(rimraf.bind(null, outpath));
  afterEach(rimraf.bind(null, outpath));

  it('Should require src', function() {
    expect(factory({ dest: 'bar' })).to.throw('config should have required property \'src\'');
  });

  it('Should require dest', function() {
    expect(factory({ src: 'foo' })).to.throw('config should have required property \'dest\'');
  });

  it('Should build SCSS files', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.scss'),
      dest: outpath
    })();
    stream.on('error', done.fail);
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
    stream.on('error', done.fail);
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
    stream.on('error', done.fail);
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
    stream.on('error', done.fail);
    stream.on('end', function() {
      var cssFile = file(path.join(outpath, 'fixture.css'));
      expect(cssFile).to.contain('a,body{color:#000}');
      done();
    });
    stream.resume();
  });
});
