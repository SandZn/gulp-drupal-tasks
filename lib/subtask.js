
function factory(taskFactory, config, opts) {
  var task;
  var i;
  var tasks = [];

  if (typeof config === 'object') {
    for (i in config) {
      if (!config.hasOwnProperty(i)) {
        continue;
      }
      task = taskFactory(config[i], opts);
      task.displayName = task.displayName + ':' + i;
      tasks.push(task);
    }
  } else {
    throw new Error('Invalid configuration type: ' + typeof config);
  }
  return tasks;
}

function lister(tasks) {
  return tasks.map(function(task) {
    return task.displayName;
  });
}

module.exports = {
  factory: factory,
  lister: lister
};


