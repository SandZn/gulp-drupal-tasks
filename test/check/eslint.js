
var path = require('path');
var factory = require('../../lib/check/eslint');
var PluginError = require('gulp-util').PluginError;
var rimraf = require('rimraf');
var fs = require('fs');

var chai = require('chai');
var chaiFiles = require('chai-files');
chai.use(chaiFiles);
var expect = chai.expect;
var file = chaiFiles.file;

var inpath = path.join(__dirname, '../../fixtures');
var outpath = path.join(__dirname, '../../out-fixtures');

describe('ESLint Task', function() {
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
    var task = factory();
    expect(task._config).to.eql({ src: [], config: null, ignorePath: null });
    expect(task._opts).to.eql({ silent: false, fix: false });
  });

  it('Should not modify the config or opts object', function() {
    var cfg = Object.freeze({});
    var opts = Object.freeze({});
    factory(cfg, opts);
  });

  it('Should run ESLint checks on matching files', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
      config: path.join(inpath, '.eslintrc'),
      ignorePath: path.join(inpath, '.eslintignore')
    }, { silent: true })();

    stream.on('error', function(err) {
      expect(err).to.be.instanceOf(PluginError);
      expect(err.message).to.equal('Failed with 1 error');
      done();
    });
    stream.on('end', function() {
      done(new Error('Expected an error to be thrown'));
    });
    stream.resume();
  });

  it('Should allow an array of globs', function(done) {
    var stream = factory({
      src: [
        path.join(inpath, '*.nonexistent'),
        path.join(inpath, '*.stillnonexistent')
      ]
    })();
    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Should output a junit report', function(done) {
    var stream = factory({
      src: [
        path.join(inpath, '*.nonexistent'),
        path.join(inpath, '*.stillnonexistent')
      ]
    }, { junitDir: path.join(outpath) })();
    stream.on('error', done);
    stream.on('end', function() {
      expect(file(path.join(outpath, 'eslint.xml'))).to.exist;
      done();
    });
    stream.resume();
  });

  it('Passes configuration options through to eslint', function(done) {
    var stream = factory({
      src: path.join(inpath, 'fixture.js'),
    })();

    stream.on('error', done);
    stream.on('end', done);
    stream.resume();
  });

  it('Should fix a file in place', function(done) {
    var filepath = path.join(outpath, 'bad.js');

    fs.mkdirSync(outpath);
    fs.writeFileSync(filepath, 'console.log("test")');
    var stream = factory({
      src: filepath
    }, { fix: true, silent: true })();
    stream.on('error', done);
    stream.on('end', function() {
      var contents = fs.readFileSync(filepath);
      expect(contents.toString()).to.equal('console.log(\'test\');\n');
      done();
    });
    stream.resume();
  });

  it('Should still throw an error if a file cannot be fixed', function(done) {
    var filepath = path.join(outpath, 'bad.js');

    fs.mkdirSync(outpath);
    fs.writeFileSync(filepath, 'var foo = true;\n');
    fs.writeFileSync(outpath + '/.eslintrc', JSON.stringify({
      rules: { 'no-unused-vars': 'error' }
    }));
    var stream = factory({
      src: filepath,
    }, { fix: true, silent: true })();
    stream.on('error', function(err) {
      expect(err.message).to.equal('Failed with 1 error');
      expect(file(filepath)).to.contain('var foo = true;\n');
      done();
    });
    stream.on('end', function() {
      done(new Error('Error was expected but not found.'));
    });
    stream.resume();
  });
});
