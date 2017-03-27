

var gulpfileBuilder = require('../lib');
var expect = require('chai').expect;
var Orchestrator = require('orchestrator');

describe('Configured tasks', function() {

  describe('With empty config', function() {
    // Use orchestrator directly here.  Gulp returns a singleton that makes
    // testing hard.
    var gulp = require('gulp-help')(new Orchestrator());
    var config = {};
    gulpfileBuilder(gulp, config, {});

    var tasks = [
      'build',
      'check',
      'install',
      'test',
      // These two are added by orchestrator/gulp-help.
      'help',
      'default'
    ];

    it('Should have a known set of tasks', function() {
      expect(Object.keys(gulp.tasks)).to.have.members(tasks);
    });
  });

  describe('With sample config', function() {
    // Use orchestrator directly here.  Gulp returns a singleton that makes
    // testing hard.
    var gulp = require('gulp-help')(new Orchestrator());
    var input = require('../fixtures/gulpconfig-v1.json');
    var config = require('../lib/config')(input);
    gulpfileBuilder(gulp, config, {});

    var tasks = [
      'help',
      'default',
      'install',
      'install:bower',
      'install:composer',
      'build',
      'build:copy',
      'build:copy:theme',
      'build:js',
      'build:js:theme',
      'build:scss',
      'build:scss:theme',
      'build:watch',
      'check',
      'check:composer',
      'check:eslint',
      'check:phpcs',
      'check:phplint',
      'check:watch',
      'test',
      'test:phpunit',
      'test:backstopjs',
      'test:behat',
      'test:phantomas',
      'watch'
    ];

    it('Should have all tasks', function() {
      expect(Object.keys(gulp.tasks).sort()).to.eql(tasks.sort());
    });
  });
});


