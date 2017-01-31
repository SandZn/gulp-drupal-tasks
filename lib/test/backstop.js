'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var spawn = require('child-process-promise').spawn;

module.exports = function (config, opts) {
  function testBackstop() {
    var dir = path.resolve('backstop');
    var op = opts.rebase ? 'reference' : 'test';
    var backstopProcess = spawn('docker', ['run', '--rm', '-v', dir + ':/src', '-e', 'BASE_URL=' + config.baseUrl, 'docksal/backstopjs', op, '--configPath=backstop.js'], {
      stdio: ['inherit', 'inherit', 'inherit']
    });
    function copyArtifacts() {
      return new Promise(function (resolve, reject) {
        gulp.src(dir + '/{comparisons,reports,reference}/**')
          .pipe(gulp.dest(opts.artifactDir))
          .on('end', resolve)
          .on('error', reject);
      });
    }
    function copyJunit() {
      return new Promise(function (resolve, reject) {
        gulp.src(dir + '/reports/xunit.xml')
          .pipe(gulp.dest(path.join(opts.junitDir, 'backstop')))
          .on('end', resolve)
          .on('error', reject);
      });
    }
    function onSuccess() {
      var promises = [];
      if (opts.junitDir) {
        promises.push(copyJunit());
      }
      if (opts.artifactDir) {
        promises.push(copyArtifacts());
      }
      return Promise.all(promises);
    }
    function onFailure(reason) {
      return onSuccess()
        .then(function() {
          throw new gutil.PluginError('backstop', reason);
        });
    }
    return backstopProcess.then(onSuccess, onFailure);
  }
  testBackstop.description = 'Run BackstopJS tests.';
  testBackstop.options = {
    'artifact-dir': 'A directory to output the test report to.',
    'junit-dir': 'A directory to output a junit formatted report to.',
    'rebase': 'Regenerate the reference screenshots.',
  };
  return testBackstop;
};
