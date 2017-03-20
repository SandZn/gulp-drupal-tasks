
var path = require('path');
var factory = require('../../lib/test/phantomas');
var http = require('http');
var rimraf = require('rimraf');
var chai = require('chai');
var PluginError = require('gulp-util').PluginError;

var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var inpath = path.join(__dirname, '../../fixtures');
var outpath = path.join(__dirname, '../../out-fixtures');

describe('Phantomas Task', function() {
  var server = http.createServer(function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    switch (req.url) {
      case '/bigpage.html':
        res.end('<!html><body><img src="/foo.jpg" /></body>');
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
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
  });

  it('Should use the default config', function() {
    var configs = [undefined, {}];
    configs.forEach(function(config) {
      var task = factory(config);
      expect(task._config).to.eql({
        src: [],
        bin: null,
        baseUrl: null,
        artifactGlob: null
      });
      expect(task._opts).to.eql({ silent: false, artifactDir: null });
    });
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run phantomas', function(done) {
    var outArtifacts = path.join(outpath, 'distartifacts');
    var stream = factory({
      src: path.join(inpath, 'phantomas.yaml'),
      artifactGlob: path.join(outpath, 'srcartifacts', '*'),
    }, { silent: true,  artifactDir: outArtifacts })();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outArtifacts, 'homepage.har'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should fail if the performance budget is exceeded', function(done) {
    var outArtifacts = path.join(outpath, 'distartifacts');
    var task = factory({
      src: path.join(inpath, 'phantomas-fail.yaml'),
      artifactGlob: path.join(outpath, 'srcartifacts', '*')
    }, { silent: true, artifactDir: outArtifacts });
    var stream = task();
    stream.on('error', function() {
      expect(file(path.join(outArtifacts, 'homepage.har'))).to.exist;
      done();
    });
    stream.on('end', function() {
      done(new Error('Task did not fail.'));
    });
    stream.resume();
  });
});
