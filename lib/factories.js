
var gutil = require('gulp-util');

var factories = { install: {}, check: {}, test: {}, build: {} };
factories.install.composer = require('./install/composer');
factories.install.bower = require('./install/bower');

factories.check.composer = require('./check/composer');
factories.check.phplint = require('./check/phplint');
factories.check.phpcs = require('./check/phpcs');
factories.check.eslint = require('./check/eslint');

factories.test.behat = require('./test/behat');
factories.test.backstop = require('./test/backstop');
factories.test.phantomas = require('./test/phantomas');
factories.test.phpunit = require('./test/phpunit');

factories.build.scss = require('./build/scss');
factories.build.js = require('./build/js');
factories.build.copy = require('./build/copy');

factories.watch = function watchTaskFactory(gulp, prefix, opts, description) {
  var PLUGIN_NAME = 'lcm-gulp-watch-' + prefix;

  if (!gulp || typeof gulp.tasks === 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'gulp must be passed to watch');
  }
  if (typeof prefix !== 'string') {
    throw new gutil.PluginError(PLUGIN_NAME, 'prefix must be a string');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  var opts = Object.assign({}, opts);

  var watched = [];
  for (taskname in gulp.tasks) {
    if (!gulp.tasks.hasOwnProperty(taskname)) {
      continue;
    }
    if (prefix.length && taskname.indexOf(prefix) !== 0) {
      continue;
    }
    if (gulp.tasks[taskname].fn._watch) {
      watched.push(taskname);
    }
  }

  function watch() {
    for (taskname in gulp.tasks) {
      if (!gulp.tasks.hasOwnProperty(taskname)) {
        continue;
      }
      if (prefix.length > 0 && taskname.indexOf(prefix) !== 0) {
        continue;
      }
      if (gulp.tasks[taskname].fn._watch) {
        gulp.watch(gulp.tasks[taskname].fn._watch, [taskname]);
      }
    }
  }
  watch.displayName = prefix.length ?  prefix + ':watch' : 'watch';
  watch.description = description;
  watch._opts = opts;
  watch._watched = watched;

  return watch;
};

module.exports = factories;
