
var gulp = require('gulp-help')(require('gulp'));
var factory = require('../');
var expect = require('chai').expect;

var config = {
  phpCheck: ['foo'],
  jsCheck: ['bar'],
  scss: {
    libs: {
      src: './foo',
      dest: './bar',
    }
  },
  js: {
    libs: {
      src: './jssrc',
      dest: './jsdist',
    }
  },
  copy: {
    images: {
      src: './imgsrc',
      dest: './imgdist',
    }
  }
};
var opts = { opt1: true };

describe('Configured tasks', function() {
  factory(gulp, config, opts);

  it('Should have a configured install:composer task', checkTask.bind(checkTask,
    gulp.tasks['install:composer'],
    { src: './composer.json' },
    { opt1: true }
  ));

  it('Should have a configured install:bower task', checkTask.bind(checkTask,
    gulp.tasks['install:bower'],
    { src: '.' },
    { opt1: true }
  ));

  it('Should have a configured install task', checkMetaTask.bind(null,
    gulp.tasks['install'],
    ['install:composer', 'install:bower']
  ));

  it('Should have a configured check:composer task', checkTask.bind(null,
    gulp.tasks['check:composer'],
    { src: './composer.json' },
    { opt1: true }
  ));

  it('Should have a configured check:phpcs task', checkTask.bind(null,
    gulp.tasks['check:phpcs'],
    { src: ['foo'] },
    { opt1: true }
  ));

  it('Should have a configured check:eslint task', checkTask.bind(null,
    gulp.tasks['check:eslint'],
    { src: ['bar'] },
    { opt1: true }
  ));

  it('Should have a configured check:phplint task', checkTask.bind(null,
    gulp.tasks['check:phplint'],
    { src: ['foo'], bin: '' },
    { opt1: true }
  ));

  it('Should have a configured check task', checkMetaTask.bind(null,
    gulp.tasks['check'],
    ['check:composer', 'check:phplint', 'check:phpcs', 'check:eslint']
  ));

  it('Should have a configured build:scss:libs task', checkTask.bind(null,
    gulp.tasks['build:scss:libs'],
    { src: './foo', dest: './bar', maps: false, prefix: { browsers: 'last 2 versions' }, sassOptions: {} },
    { opt1: true }
  ));
  it('Should have a meta build:scss task', checkMetaTask.bind(null,
    gulp.tasks['build:scss'],
    ['build:scss:libs']
  ));

  it('Should have a configured build:js:libs task', checkTask.bind(null,
    gulp.tasks['build:js:libs'],
    {
      src: './jssrc',
      dest: './jsdist',
      concat: false,
      maps: false,
      min: false
    },
    { opt1: true }
  ));

  it('Should have a meta build:js task', checkMetaTask.bind(null,
    gulp.tasks['build:js'],
    ['build:js:libs']
  ));

  it('Should have a configured build:copy:images task', checkTask.bind(null,
    gulp.tasks['build:copy:images'],
    { src: './imgsrc', dest: './imgdist', imagemin: false },
    { opt1: true }
  ));

  it('Should have a meta build:copy task', checkMetaTask.bind(null,
    gulp.tasks['build:copy'],
    ['build:copy:images']
  ));

  it('Should have a meta build task', checkMetaTask.bind(null,
    gulp.tasks['build'],
    ['build:scss', 'build:js', 'build:copy']
  ));

  it('Should have a configured test:behat task', checkTask.bind(null,
    gulp.tasks['test:behat'],
    { bin: '' },
    { opt1: true, junitDir: null }
  ));

  it('Should have a configured test:phantomas task', checkTask.bind(null,
    gulp.tasks['test:phantomas'],
    { src: [], bin: './node_modules/.bin/phantomas' },
    { opt1: true }
  ));

  it('Should have a meta test task', checkMetaTask.bind(null,
    gulp.tasks['test'],
    ['test:behat', 'test:phantomas']
  ));


  function checkTask(task, expectedConfig, expectedOpts) {
    expect(task).to.be.an('object');
    expect(task.fn).to.be.a('function');
    expect(task.fn._config).to.eql(expectedConfig);
    expect(task.fn._opts).to.eql(expectedOpts);
  }
  function checkMetaTask(task, expectedDeps) {
    expect(task).to.be.an('object');
    expect(task.dep).to.eql(expectedDeps);
  }
});
