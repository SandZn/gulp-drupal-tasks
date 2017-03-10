'use strict';
var tasks = require('./lib');

var subtaskFactory = require('./lib/subtask').factory;

module.exports = function (gulp, config, opts) {
  var describedTask = function(task) {
    this.task(task.displayName, task.description, task, {options: task.options});
  }.bind(gulp);

  var metaTask = function(prefix, description) {
    var subtaskKeys = Object.keys(this.tasks).filter(function(key) {
      // Find only subtasks that are direct descendents, not second level.
      // Ex: given a prefix of `build`, only return build:scss, not build:scss:libs
      return key.indexOf(prefix + ':') === 0 && key.slice(prefix.length + 1).indexOf(':') === -1;
    });
    this.task(prefix, description, subtaskKeys);
  }.bind(gulp);

  describedTask(tasks.install.composer({}, opts));
  describedTask(tasks.install.bower({}, opts));
  describedTask(tasks.check.composer({}, opts));
  describedTask(tasks.check.phplint({
    src: config.phpCheck
  }, opts));
  describedTask(tasks.check.phpcs({
    src: config.phpCheck,
  }, opts));
  describedTask(tasks.check.eslint({
    src: config.jsCheck
  }, opts));

  var scssTasks = subtaskFactory(tasks.build.scss, config.scss, opts);
  var jsTasks = subtaskFactory(tasks.build.js, config.js, opts);
  var copyTasks = subtaskFactory(tasks.build.copy, config.copy, opts);
  scssTasks.forEach(describedTask);
  jsTasks.forEach(describedTask);
  copyTasks.forEach(describedTask);

  describedTask(tasks.test.behat({}, opts));
  describedTask(tasks.test.phantomas({}, opts));

  metaTask('install', 'Run all install tasks.');
  metaTask('build:scss', 'Build CSS from SCSS');
  metaTask('build:js', 'Build JS files');
  metaTask('build:copy', 'Copy source files and minify images');
  metaTask('build', 'Run all build tasks.');
  metaTask('check', 'Run all check tasks.');
  metaTask('test', 'Run all test steps.');
}
