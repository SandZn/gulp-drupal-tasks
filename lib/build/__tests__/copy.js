
var factory = require('../copy');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var outpath = path.join(__dirname, '../../__out-fixtures');
var inpath = path.join(__dirname, '../../__fixtures');

describe('Copy task', function() {
  beforeEach(rimraf.bind(null, outpath));
  afterEach(rimraf.bind(null, outpath));

  it('Should not do anything if an empty config is passed.', function() {
    var task = factory();
    var stream = task([]);
    expect(stream).to.be.null;
  });

  it('Should copy a file from src to dest', function(done) {
    var task = factory([{
      src: path.join(inpath, 'fixture.txt'),
      dest: outpath
    }]);
    var stream = task();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'fixture.txt'))).to.exist;
      done();
    });
    // @todo: this triggers the stream to flow.  There must be a better way.
    stream.on('data', function() {});
  });

  it('Should minify an image if requested to do so', function(done) {
    var task = factory([{
      src: path.join(inpath, 'fixture.png'),
      imagemin: true,
      dest: outpath
    }]);

    var stream = task();
    stream.on('error', done);
    stream.on('end', function() {
      var originalFile = file(path.join(inpath, 'fixture.png'));
      var optimizedFile = file(path.join(outpath, 'fixture.png'));
      expect(optimizedFile).to.exist;
      expect(optimizedFile.stats.size).to.be.below(originalFile.stats.size);
      done();
    });
    stream.resume();
  });
});
