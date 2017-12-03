
var gutil = require('gulp-util');

var factories = { build: {} };

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
