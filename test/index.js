
var gulp = require('gulp-help')(require('gulp'));
var gulpfileBuilder = require('../lib');
var expect = require('chai').expect;

describe('Configured tasks', function() {
  gulpfileBuilder(gulp, {}, {});


  var tasks = [
    'build',
    'build:copy',
    'build:js',
    'build:scss',
    'build:watch',
    'check',
    'check:composer',
    'check:eslint',
    'check:phpcs',
    'check:phplint',
    'install',
    'install:bower',
    'install:composer',
    'test',
    'test:backstopjs',
    'test:behat',
    'test:phantomas',
  ];

  for (var i = 0; i < tasks.length; i++) {
    var name = tasks[i];
    it('Should have a ' + name + ' task', function () {
      expect(gulp.tasks).to.include.keys(name);
    });
  }
});
