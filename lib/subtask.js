
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
  }  else if (typeof config === 'array') {
    for (i = 0; i < config.length; i++) {
      task = taskFactory(config[i], opts);
      task.displayName = task.displayName + ':' + i;
      tasks.push(task);
    }
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


