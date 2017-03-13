
var factory = require('../../lib/test/backstop');
var path = require('path');
var rimraf = require('rimraf');
var chai = require('chai');
var chaiFiles = require('chai-files');
var PluginError = require('gulp-util').PluginError;
var http = require('http');
var ip = require('ip');

chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;
var dir = chaiFiles.dir;

var inpath = path.join(__dirname, '../../fixtures/backstop');
var outpath = path.join(__dirname, '../../fixtures/backstop/out');

describe('Backstop task', function() {
  var server = http.createServer(function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    switch (req.url) {
      case '/':
      case '/rebase':
        res.end('<!html><body><h1>Hello, World!</h1></body>');
        break;
      case '/nomatch':
        res.end('<!html><body><h1>This should not match.</h1></body>');
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

  afterEach(rimraf.bind(null, outpath, {}));
  beforeEach(rimraf.bind(null, outpath, {}));

  it('Should should fall back to a default config', function() {
    var task = factory();
    expect(task._config).to.eql({
      src: null,
      junitGlob: null,
      artifactGlob: null,
      baseUrl: null
    });
    var task = factory({});
    expect(task._config).to.eql({
      src: null,
      junitGlob: null,
      artifactGlob: null,
      baseUrl: null
    });
  });

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, '')).to.throw(PluginError, 'config must be an object');
    expect(factory.bind(factory, {}, '')).to.throw(PluginError, 'opts must be an object');
    expect(factory.bind(null, {
      src: {}
    })).to.throw(PluginError, 'src must be a string pointing to the backstop configuration file, or null');
    expect(factory.bind(null, {
      junitGlob: {}
    })).to.throw(PluginError, 'junitGlob must be a string glob, or null');
    expect(factory.bind(null, {
      artifactGlob: {}
    })).to.throw(PluginError, 'artifactGlob must be a string glob, or null');
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should do nothing when called with an empty src', function() {
    var task = factory();
    task(function(err) {
      expect(err).to.be.undefined;
    });
  });

  it('Should pass backstop when the screenshots match.', function(done) {
    var task = factory({
      src: path.join(inpath, 'backstop.js'),
      baseUrl: 'http://' + ip.address() + ':9763'
    });
    task(function(err) {
      done(err);
    });
  });

  it('Should fail when the screenshots do not match.', function(done) {
    var task = factory({
      src: path.join(inpath, 'backstop.js'),
      baseUrl: 'http://' + ip.address() + ':9763/nomatch'
    });
    task(function(err) {
      expect(err).to.be.an.instanceOf(PluginError);
      expect(err.message).to.contain('Mismatch errors found');
      done();
    });
  });

  it('Should update reference screenshots when the rebase flag is passed.', function(done) {
    var task = factory({
      src: path.join(inpath, 'backstop.js'),
      // Use an alternate URL so we know to switch the reference directory to
      // the outpath.
      baseUrl: 'http://' + ip.address() + ':9763/rebase'
    }, { rebase: true });
    task(function(err) {
      expect(file(outpath + '/reference/visual_Homepage_0_document_0_phone.png')).to.exist;
      done(err);
    });
  });

  // This kind of breaks the one thing per test rule, but these tests are really
  // slow.
  it('Should copy junit files to the specified junit directory, and artifact files to the artifact directory', function(done) {
    var task = factory({
      src: path.join(inpath, 'backstop.js'),
      baseUrl: 'http://' + ip.address() + ':9763',
      junitGlob: path.join(inpath, 'out/xunit.xml'),
      artifactGlob: path.join(inpath, 'out/{reports,comparisons}/**')
    }, {
      junitDir: path.join(outpath, 'moved/junit'),
      artifactDir: path.join(outpath, 'moved/artifacts')
    });
    task(function(err) {
      expect(file(path.join(outpath, 'moved/junit/xunit.xml'))).to.exist;
      expect(dir(path.join(outpath, 'moved/artifacts/reports'))).to.exist;
      expect(dir(path.join(outpath, 'moved/artifacts/comparisons'))).to.exist;
      done(err);
    });
  });
});
