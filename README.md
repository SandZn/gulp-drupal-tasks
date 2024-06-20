Gulp Drupal Tasks
=================

[![CircleCI](https://circleci.com/gh/LastCallMedia/gulp-drupal-tasks.svg?style=svg)](https://circleci.com/gh/LastCallMedia/gulp-drupal-tasks) 
[![codecov](https://codecov.io/gh/LastCallMedia/gulp-drupal-tasks/branch/master/graph/badge.svg)](https://codecov.io/gh/LastCallMedia/gulp-drupal-tasks)

Gulp Drupal Tasks is brought to you by your friends at [Last Call Media](https://www.lastcallmedia.com), this library provides a set of common Gulp tasks for working with PHP/Drupal. The goals are:

1. Provide a single point of management for updating the Gulp tasks across all of LCM's Drupal builds.
2. Have excellent test coverage to make sure everything (still) works.
3. Reduce the install time and speed up the Gulp boot process by providing lighter weight alternatives to heavier Gulp plugins.

Usage:
------
1. Install this package using NPM
2. Create a gulpfile that looks similar to this:
    ```javascript
    var gulp = require('gulp');
    var Registry = require('lastcall-gulp-drupal-tasks');
    var config = require('./gulpconfig');
    
    // Register common tasks.  Use `gulp --tasks` to get a current list.
    gulp.registry(new Registry(config));
    // Set the default task.
    gulp.task('default', gulp.series('build:watch'));
    ```
3.  Create a [`gulpconfig.js` file](docs/config-reference.js).

Upgrading from 2.0.0:
---------------------
To update from 2.0, simply update your `gulpfile.js` to the above snippet.

**Important changes from 2.x:**

- Just running `gulp` no longer gives you a nicely formatted task list - it now executes the `build:watch` command by default. To get a task list, use `gulp --tasks` to get a listing.

Guidelines for development:
--------------------------
1. Tasks should be small and composable.
2. All tasks should be asynchronous to take advantage of Gulp parallelization.
3. All tasks should fail predictably (no plugin failures that don't also fail the build).
4. Task configuration should be explicitly checked as quickly as possible.
5. Don't put slow calls into the critical path.  Gulp boot should be as fast as possible.  Delay slow requires or file existence checks until the task is actually executed.

Publishing on NPM
-----------------
When you are ready to release a new version, run `npm version X.X.X`.  This will update the version in package.json, and create a new tagged commit.  Just push it to github using `git push origin master --follow-tags`, and CircleCI will deploy it to NPM.
