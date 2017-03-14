'use strict';
var tasks = require('./lib');
var configBuilder = require('./lib/config');

var subtaskFactory = require('./lib/subtask').factory;

module.exports = {
  buildConfig: configBuilder,
  addTasks: addTasks
}

function addTasks(gulp, config, opts) {
  var describedTask = function(task, deps) {
    deps = deps || [];
    this.task(
      task.displayName,
      task.description,
      deps,
      task,
      { options: task.options }
    );
  }.bind(gulp);

  var metaTask = function(prefix, description) {
    var subtaskKeys = Object.keys(this.tasks).filter(function(key) {
      // Find only subtasks that are direct descendents, not second level.
      // Ex: given a prefix of `build`, return build:scss, not build:scss:libs
      return key.indexOf(prefix + ':') === 0
        && key.slice(prefix.length + 1).indexOf(':') === -1;
    });
    this.task(prefix, description, subtaskKeys);
  }.bind(gulp);

  describedTask(tasks.install.composer(config.install.composer, opts));
  describedTask(tasks.install.bower(config.install.bower, opts));
  describedTask(tasks.check.composer(config.check.composer, opts));
  describedTask(tasks.check.phplint(config.check.phplint, opts));
  describedTask(tasks.check.phpcs(config.check.phpcs, opts));
  describedTask(tasks.check.eslint(config.check.eslint, opts));

  function addSubtask(subtask) {
    describedTask(subtask);
  }
  var scssTasks = subtaskFactory(tasks.build.scss, config.build.scss, opts);
  var jsTasks = subtaskFactory(tasks.build.js, config.build.js, opts);
  var copyTasks = subtaskFactory(tasks.build.copy, config.build.copy, opts);
  scssTasks.forEach(addSubtask);
  jsTasks.forEach(addSubtask);
  copyTasks.forEach(addSubtask);

  describedTask(tasks.test.behat(config.test.behat, opts));
  describedTask(tasks.test.phantomas(config.test.phantomas, opts));
  describedTask(tasks.test.backstop(config.test.backstopjs, opts));

  metaTask('install', 'Run all install tasks.');
  metaTask('build:scss', 'Build CSS from SCSS');
  metaTask('build:js', 'Build JS files');
  metaTask('build:copy', 'Copy source files and minify images');
  metaTask('build', 'Run all build tasks.');
  metaTask('check', 'Run all check tasks.');
  metaTask('test', 'Run all test steps.');

  describedTask(tasks.build.watch(gulp, opts), ['build']);
}
