
var path = require('path');
var factory = require('../phantomas');
var http = require('http');
var rimraf = require('rimraf');
var expect = require('chai').expect;
var PluginError = require('gulp-util').PluginError;

var inpath = path.join(__dirname, '../../__fixtures');
var outpath = path.join(__dirname, '../../__out-fixtures');

describe('Phantomas Task', function() {

  var server = http.createServer(function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    switch (req.url) {
      case '/bigpage.html':
        res.end('<!html><body><img src="/foo.jpg" /><img src="/bar.jpg" /><img src="/baz.jpg" />');
        break;
      default:
        res.end('<!html><body></body>');
    }
  });

  before(function(done) {
    server.listen(9763, function() {
      done();
    });
  });
  after(function(done) {
    server.close(function() {
      done();
    });
  });
  beforeEach(rimraf.bind(null, outpath, {}));
  afterEach(rimraf.bind(null, outpath, {}));

  it('Should do nothing if it is called with an empty config', function() {
    var stream = factory()();
    expect(stream).to.be.an('object');
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError);
    expect(factory.bind(factory, {}, '')).to.throw(PluginError);
  });

  it('Should use the default config', function() {
    var task = factory();
    expect(task._config).to.eql({ src: [], bin: './node_modules/.bin/phantomas' });
    expect(task._opts).to.eql({});
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run phantomas', function(done) {
    var stream = factory({
      src: path.join(inpath, 'phantomas.yaml'),
      silent: true,
    })();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Should fail if the performance budget is exceeded', function(done) {
    var task = factory({
      src: path.join(inpath, 'phantomas-fail.yaml'),
      silent: true,
    });
    var stream = task();
    stream.on('error', function() {
      done();
    });
    stream.on('end', function() {
      done(new Error('Task did not fail.'));
    });
    stream.resume();
  });

//  it('Should copy report files to the destination', function(done) {
//    var stream = factory({
//      src: path.join(inpath, 'phantomas.yaml'),
//      silent: true,
//      dest: outpath
//    })();
//    stream.on('error', done.fail);
//    stream.on('end', function() {
//      expect(file(path.join(outpath, 'phantomas.txt'))).to.exist;
//      done();
//    });
//    stream.resume();
//  });
});
