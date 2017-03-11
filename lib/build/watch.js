
var gulp = require('gulp');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'lcm-build-watch-task';
/**
 * This task loops through all of the tasks that are defined in gulp, and
 * adds a watch between the _watch property of the task callback and the task.
 */
module.exports = function(gulp, opts) {
  if (!gulp || typeof gulp.tasks === 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'gulp must be passed to watch');
  }
  if (typeof opts !== 'object' && typeof opts !== 'undefined') {
    throw new gutil.PluginError(PLUGIN_NAME, 'opts must be an object');
  }
  var opts = Object.assign({}, opts);


  function buildWatch() {
    for (taskname in gulp.tasks) {
      if(!gulp.tasks.hasOwnProperty(taskname)) {
        continue;
      }
      if(gulp.tasks[taskname].fn._watch) {
        gulp.watch(gulp.tasks[taskname].fn._watch, [taskname]);
      }
    }
  }
  buildWatch.displayName = 'build:watch';
  buildWatch.description = 'Build all assets, and watch for changes';
  buildWatch._opts = opts;

  return buildWatch;
}
