
var Registry = require('undertaker-registry');
const copyFactory = require('./build/copy');
const jsFactory = require('./build/js');
const scssFactory = require('./build/scss');


function buildTasks(taker, parentName, config, factory) {
  for (let [itemName, item] of Object.entries(config)) {
    taker.task(`${parentName}:${itemName}`, factory(item));
  }
}

function addMetaTask(taker, prefix, description, evenIfEmpty = false) {
  const collected = [];
  for (var name of taker.tree().nodes) {
    if (name.indexOf(prefix + ':') === 0 && !name.slice(prefix.length + 1).includes(':')) {
      collected.push(name);
    }
  }
  if (collected.length) {
    const task = taker.parallel(collected);
    task.description = description;

    taker.task(prefix, task);
  } else if (evenIfEmpty) {
    const fn = () => {};
    fn.description = description;
    // No-op. We still add the command though.
    taker.task(prefix, fn);
  }
}

function addWatchTask(taker, name, description) {
  // Calculate all the tasks we consider "watchable."
  const watchables = taker.tree().nodes.filter(taskName => {
    const task = taker.task(taskName).unwrap();
    return task.hasOwnProperty('_watch') && task._watch;
  });
  // Define the watch function.
  let watch = () => {
    for (let watchableName of watchables) {

      const watchableTask = taker.task(watchableName);
      taker.watch(watchableTask.unwrap()._watch, watchableTask);
    }
  };
  // Push an initial run of each watchable task onto the beginning.
  if (watchables.length > 0) {
    watch = taker.series(taker.parallel(watchables), task);
  }
  task.displayName = name;
  task.description = description;

  taker.task(name, task);
}


class CustomRegistry extends Registry {
  constructor(config) {
    super();
    this.build = config.build || {};
  }
  // Add our tasks to the registry.
  init(taker) {
    buildTasks(taker, 'build:scss', this.build.scss || {}, scssFactory);
    buildTasks(taker, 'build:js', this.build.js || {}, jsFactory);
    buildTasks(taker, 'build:copy', this.build.copy || {}, copyFactory);
    addMetaTask(taker, 'build:scss', 'Build CSS from SCSS');
    addMetaTask(taker, 'build:js', 'Build JS files');
    addMetaTask(taker, 'build:copy', 'Copy source files and minify images');
    addMetaTask(taker, 'build', 'Run all build tasks', true);
    addWatchTask(taker, 'build:watch', 'Build and watch assets for changes');
    addWatchTask(taker, 'watch', 'Build and watch assets for changes');
  }
}


module.exports = CustomRegistry;
