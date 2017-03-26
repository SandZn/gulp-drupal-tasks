
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
    var configs = [undefined, {}];
    configs.forEach(function(config) {
      var task = factory(config);
      expect(task._config).to.eql({
        src: [],
        dockerBin: null,
        junitGlob: null,
        artifactGlob: null,
        baseUrl: null
      });
      expect(task._opts).to.eql({
        junitDir: null,
        artifactDir: null,
        silent: false,
        baseUrl: null
      });
    });
  });

  var invalidConfigTests = [
    { it: 'Should fail on invalid config', config: '', message: 'config must be an object' },
    { it: 'Should fail on invalid opts', opts: '', message: 'opts must be an object' },
    { it: 'Should fail on an invalid dockerBin', config: { dockerBin: {} }, message: 'dockerBin must be a string' },
    { it: 'Should fail on an invalid src', config: { src: {} }, message: 'src must be a gulp glob' },
    { it: 'Should fail on an invalid baseurl', config: { baseUrl: {} }, message: 'baseUrl must be a string' },
    { it: 'Should fail on an invalid baseurl from opts', opts: { baseUrl: {} }, message: 'baseUrl must be a string' },
    { it: 'Should fail on an invalid artifactGlob', config: { artifactGlob: {}, message: 'artifactGlob must be a string or array of strings' } },
    { it: 'Should fail on an invalid junitGlob', config: { junitGlob: {}, message: 'junitGlob must be a string or array of strings' } },
    { it: 'Should fail on an invalid artifactDir', opts: { artifactDir: {}, message: 'artifactDir must be a string' } },
    { it: 'Should fail on an invalid junitDir', opts: { junitDir: {}, message: 'junitDir must be a string' } },
  ];

  invalidConfigTests.forEach(function(test) {
    it(test.it, function() {
      expect(factory.bind(null, test.config, test.opts)).to.throw(PluginError, test.message);
    });
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should pass backstop when the screenshots match.', function(done) {
    var task = factory({
      src: path.join(inpath, 'backstop.js'),
      junitGlob: path.join(inpath, 'out/xunit.xml'),
      artifactGlob: path.join(inpath, 'out/{reports,comparisons}/**')
    }, {
      silent: true,
      baseUrl: 'http://' + ip.address() + ':9763',
      junitDir: path.join(outpath, 'moved/junit'),
      artifactDir: path.join(outpath, 'moved/artifacts'),
    });
    var stream = task();
    stream.on('err', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'moved/junit/xunit.xml'))).to.exist;
      expect(dir(path.join(outpath, 'moved/artifacts/reports'))).to.exist;
      expect(dir(path.join(outpath, 'moved/artifacts/comparisons'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should fail when the screenshots do not match.', function(done) {
    var task = factory({
      src: path.join(inpath, 'backstop.js'),
      baseUrl: 'http://' + ip.address() + ':9763/nomatch',
      junitGlob: path.join(inpath, 'out/xunit.xml'),
      artifactGlob: path.join(inpath, 'out/{reports,comparisons}/**')
    }, {
      silent: true,
      junitDir: path.join(outpath, 'moved/junit'),
      artifactDir: path.join(outpath, 'moved/artifacts'),
    });
    var stream = task();
    stream.on('error', function(err) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.contain('Backstopjs exited with code 1');
      expect(file(path.join(outpath, 'moved/junit/xunit.xml'))).to.exist;
      expect(dir(path.join(outpath, 'moved/artifacts/reports'))).to.exist;
      expect(dir(path.join(outpath, 'moved/artifacts/comparisons'))).to.exist;
      done();
    });
    stream.on('end', function() {
      done(new Error('Expected an error'));
    });
    stream.resume();
  });

  it('Should update reference screenshots when the rebase flag is passed.', function(done) {
    var task = factory({
      src: path.join(inpath, 'backstop.js'),
      // Use an alternate URL so we know to switch the reference directory to
      // the outpath.
      baseUrl: 'http://' + ip.address() + ':9763/rebase'
    }, { rebase: true, silent: true });

    var stream = task();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(outpath + '/reference/visual_Homepage_0_document_0_phone.png')).to.exist;
      done();
    });
    stream.resume();
  });

  it('Should throw an error on an invalid docker bin', function(done) {
    var stream = factory({
      src: path.join(inpath, 'backstop.js'),
      dockerBin: '/some/nonexistent/path'
    }, { silent: false })();
    stream.on('error', function() {
      done();
    });
    stream.on('end', function() {
      throw new Error('Task did not fail.');
    });
    stream.resume();
  });
});
