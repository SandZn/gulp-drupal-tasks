
var path = require('path');
var factory = require('../phpcs');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../__fixtures');

describe('PHPCS Task', function() {

  it('Should accept an empty configuration', function() {
    var stream = factory()();
    expect(stream).to.be.an('object');
  });

  it('Should check file globs', function(done) {
    var stream = factory({
      pattern: path.join(inpath, 'fixture.php')
    })();
    stream.on('error', function(err) {
      expect(err).to.be.instanceOf(PluginError);
      expect(err.message).to.contain('PHP Code Sniffer failed on');
      done();
    });
    stream.on('end', done.fail.bind(null, new Error('Expected an error to be thrown')));
    stream.resume();
  });
});
