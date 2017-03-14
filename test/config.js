
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

    it('Should configure the install:bower task', function() {
      expect(parsed.install.bower).to.eql({
        src: 'my/bower/dir'
      });
    });

    it('Should configure the check:phpcs task', function() {
      expect(parsed.check.phpcs).to.eql({
        src: 'my/php/dir',
        standard: 'my/phpcs/standard'
      });
    });

    it('Should configure the check:phplint task', function() {
      expect(parsed.check.phplint).to.eql({
        src: 'my/php/dir'
      });
    });

    it('Should configure the check:eslint task', function() {
      expect(parsed.check.eslint).to.eql({
        src: 'my/js/dir'
      });
    });

    it('Should configure the test:behat task', function() {
      expect(parsed.test.behat).to.eql({
        src: 'behat.yml'
      });
    });

    it('Should configure the test:backstop task', function() {
      expect(parsed.test.backstopjs).to.eql({
        baseUrl: 'http://example.com:8888',
        src: 'backstop/backstop.js',
        junitGlob: 'backstop/**.xml',
        artifactGlob: 'backstop/reports/**'
      });
    });

    it('Should configure the test:phantomas task', function() {
      expect(parsed.test.phantomas).to.eql({
        baseUrl: 'http://example.com:8888',
        src: 'phantomas/phantomas.yml',
      });
    });

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
