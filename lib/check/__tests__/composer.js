
var path = require('path');
var factory = require('../composer');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../__fixtures');

describe('Composer Validate Task', function() {

  it('Should run composer validate', function(done) {
    var task = factory({
      src: inpath
    });

    task(function(err) {
      expect(err).to.be.instanceof(PluginError);
      expect(err.message).to.contain('composer.json is valid for simple usage with composer');
      done();
    });
  });

  it('Should throw an error on an invalid directory', function(done) {
    var task = factory({
      src: path.join(inpath, 'nonexistent')
    });

    task(function(err) {
      expect(err).to.be.instanceof(PluginError);
      expect(err.message).to.contain('Invalid working directory specified');
      done();
    });
  })
});
