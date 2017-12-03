
var configBuilder = require('../lib/config');
var expect = require('chai').expect;


describe('Config adapter', function() {

  it('Should default to version 1', function() {
    var config = configBuilder({});
    expect(config.version).to.equal(1);
  });

  it('Should throw an exception when given an invalid version', function() {
    var cb = configBuilder.bind(null, { version: 19 });
    expect(cb).to.throw(Error, 'Invalid config version: 19');
  });

  describe('Config v1', function() {
    var input = require('../fixtures/gulpconfig-v1.json');
    var parsed = configBuilder(input);

    it('Should configure the build:scss task', function() {
      expect(parsed.build.scss).to.eql({
        theme: {
          src: '*.scss',
          dest: 'dist/'
        }
      });
    });

    it('Should configure the build:js task', function() {
      expect(parsed.build.js).to.eql({
        theme: {
          src: '*.js',
          dest: 'dist/'
        }
      });
    });

    it('Should configure the build:copy task', function() {
      expect(parsed.build.copy).to.eql({
        theme: {
          src: '*.jpg',
          dest: 'dist/'
        }
      });
    });
  });
});
