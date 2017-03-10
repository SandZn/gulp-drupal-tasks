
var path = require('path');
var factory = require('../behat');
var which = require('which');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../__fixtures');

describe('Behat Task', function() {

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({bin: ''});
    expect(task._opts).to.eql({junitDir: null});
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError);
    expect(factory.bind(factory, {}, '')).to.throw(PluginError);
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run behat', function(done) {
    var stream = factory({
      configFile: path.join(inpath, 'behat.yml'),
      bin: which.sync('behat'),
      suite: 'passing',
      silent: true,
    })();
    stream.on('error', done.fail);
    stream.on('end', done);
    stream.resume();
  });

  it('Should throw an error on behat failures', function(done) {
    var stream = factory({
      configFile: path.join(inpath, 'behat.yml'),
      bin: which.sync('behat'),
      suite: 'failing',
      silent: true,
    })();
    stream.on('error', done);
    stream.on('end', done.fail.bind(null, new Error('Task did not fail.')));
    stream.resume();
  });
});
