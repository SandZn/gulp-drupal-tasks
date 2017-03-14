Gulp Drupal Tasks
=================

[![CircleCI](https://circleci.com/gh/LastCallMedia/gulp-drupal-tasks.svg?style=svg)](https://circleci.com/gh/LastCallMedia/gulp-drupal-tasks) 
[![codecov](https://codecov.io/gh/LastCallMedia/gulp-drupal-tasks/branch/master/graph/badge.svg)](https://codecov.io/gh/LastCallMedia/gulp-drupal-tasks)

This library provides a set of common Gulp tasks for working with PHP/Drupal. The goals are:

1. Provide a single point of management for updating the Gulp tasks across all of LCM's Drupal builds.
2. Have excellent test coverage to make sure everything (still) works.
3. Reduce the install time and speed up the Gulp boot process by providing lighter weight alternatives to heavier Gulp plugins.

Usage:
------
1. Install this package using NPM
2. Create a gulpfile that looks similar to this:
    ```javascript
    // Load in CLI flags.
    var opts = require('yargs').argv;
  
    var gulp = require('gulp-help')(require('gulp'));
    var addTasks = require('./lastcall-gulp-drupal-tasks');
  
    var config = require('./gulpconfig');
    addTasks(gulp, config, opts);
    ```
3.  Create a [`gulpconfig.js` file](docs/config-reference.js).

Guidelines for development:
--------------------------
1. Tasks should be small and composable.
2. All tasks should be asynchronous to take advantage of Gulp parallelization.
3. All tasks should fail predictably (no plugin failures that don't also fail the build).
4. Task configuration should be explicitly checked as quickly as possible.
5. Don't put slow calls into the critical path.  Gulp boot should be as fast as possible.  Delay slow requires or file existence checks until the task is actually executed.
