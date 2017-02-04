
var path = require('path');
var factory = require('../eslint');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../__fixtures');

describe('ESLint Task', function() {

  it('Should do nothing if it is called with an empty config', function() {
    var stream = factory()();
    expect(stream).to.be.an('object');
  });

  it('Should run ESLint checks on matching files', function(done) {
    var outStream = function() {};
    var stream = factory({
      jsCheck: path.join(inpath, 'fixture.js'),
      logOutput: outStream
    })();

    stream.on('error', function(err) {
      expect(err).to.be.instanceOf(PluginError);
      expect(err.message).to.equal('Failed with 1 error');
      done();
    });
    stream.on('end', function() {
      expect.fail();
      done();
    });
    stream.resume();
  });

  it('Should allow an array of globs', function(done) {
    var stream = factory({
      jsCheck: [
        path.join(inpath, '*.nonexistent'),
        path.join(inpath, '*.stillnonexistent')
      ]
    })();
    stream.on('end', done);
    stream.resume();
  });
})
