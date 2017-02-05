
var factory = require('../composer');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');
var PluginError = require('gulp-util').PluginError;

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;
var dir = chaiFiles.dir;

var inpath = path.join(__dirname, '../../__fixtures');
var outpath = path.join(__dirname, '../../__fixtures/vendor');

describe('Composer task', function() {
  afterEach(rimraf.bind(null, outpath));
  beforeEach(rimraf.bind(null, outpath));

  it('Should install composer dependencies', function(done) {
    var task = factory({
      src: inpath,
      quiet: true
    });

    task(function() {
      expect(dir(outpath)).to.exist;
      done();
    });
  });

  it('Should fail install on an invalid composer file', function(done) {
    var task = factory({
      src: path.join(inpath, 'nonexistant'),
      quiet: true
    });

    task(function(err) {
      expect(err).to.be.instanceof(PluginError);
      expect(err.message).to.contain('Invalid working directory specified');
      done();
    });
  });
});
