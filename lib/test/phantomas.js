'use strict';

var gutil = require('gulp-util');
var exec = require('child-process-promise').exec;

module.exports = function (config) {
  function testPhantomas() {
    var promises = [];
    var promise;
    var cli;
    var name;
    var test;
    var url;

    function createSuccessReporter(name) {
      return function (result) {
        gutil.log('PASS: ' + name);
        gutil.log('-----------------');
        var data = JSON.parse(result.stdout);
        gutil.log('Requests: ' + data.metrics.requests);
        gutil.log('Time to http complete: ' + data.metrics.httpTrafficCompleted + 'ms');
        gutil.log('Size: ' + data.metrics.contentLength + 'b');
      };
    }
    function createFailReporter(name) {
      return function (result) {
        gutil.log('FAIL:' + name);
        gutil.log('-----------------');

        try {
          gutil.log(result.stderr);
          var data = JSON.parse(result.stdout);
          for (var i = 0; i < data.asserts.failedAsserts.length; i++) {
            var assertName = data.asserts.failedAsserts[i];
            gutil.log(assertName + ': ' + data.metrics[assertName]);
          }
        } catch (err) {
          // No-op.
        }
        throw new gutil.PluginError('phantomas', {
          message: 'Performance tests failed for ' + name
        });
      };
    }

    for (var i = 0; i < config.perfTests.length; i++) {
      test = config.perfTests[i];
      name = test.name;
      url = config.baseUrl + test.url;
      cli = '';
      for (var prop in test) {
        if (test.hasOwnProperty(prop) && prop !== 'url' && prop !== 'name') {
          cli += ' --' + prop + '="' + test[prop] + '"';
        }
      }
      cli += ' --reporter=json ' + url;

      promise = exec('./node_modules/.bin/phantomas' + cli)
        .then(createSuccessReporter(name))
        .catch(createFailReporter(name));
      promises.push(promise);
    }

    // Return a chain of all the promises.
    return Promise.all(promises);
  }

  testPhantomas.description = 'Run Phantomas performance tests.';
  testPhantomas.options = {};
  return testPhantomas;
};
