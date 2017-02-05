
var factory = require('../bower');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');
var PluginError = require('gulp-util').PluginError;

chai.use(chaiFiles);
var expect = chai.expect;
var dir = chaiFiles.dir;

var inpath = path.join(__dirname, '../../__fixtures');
var outpath = path.join(__dirname, '../../__fixtures/bower_components');

describe('Bower task', function() {
  afterEach(rimraf.bind(null, outpath));
  beforeEach(rimraf.bind(null, outpath));

  it('Should install bower dependencies', function(done) {
    var task = factory({src: inpath});
    task(function() {
      expect(dir(outpath)).to.exist;
      done();
    });
  });

  it('Should fail on installing in an invalid directory', function(done) {
    var task = factory({src: path.join(inpath, 'nonexistent')});

    task(function(err) {
      expect(err).to.be.instanceof(PluginError);
      expect(err.message).to.contain('spawn /bin/sh ENOENT');
      done();
    });
  });
});
