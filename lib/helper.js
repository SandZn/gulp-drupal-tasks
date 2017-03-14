
function Helper(gulp) {
  this.gulp = gulp;
}

Helper.prototype.addMetaTask = function(prefix, description) {
  var subtaskKeys = Object.keys(this.gulp.tasks).filter(function(key) {
    // Find only subtasks that are direct descendents, not second level.
    // Ex: given a prefix of `build`, return build:scss, not build:scss:libs
    return key.indexOf(prefix + ':') === 0
      && key.slice(prefix.length + 1).indexOf(':') === -1;
  });
  this.gulp.task(prefix, description, subtaskKeys);
};

Helper.prototype.addDescribedTask = function(task, deps) {
  deps = deps || [];
  this.gulp.task(
    task.displayName,
    task.description,
    deps,
    task,
    { options: task.options }
  );
};

Helper.prototype.addSubtasks = function(taskFactory, config, opts) {
  if(typeof taskFactory !== 'function') {
    throw new Error('Task factory must be a function');
  }

  if (typeof config === 'object') {
    for (i in config) {
      if (!config.hasOwnProperty(i)) {
        continue;
      }
      var task = taskFactory(config[i], opts);
      task.displayName = task.displayName + ':' + i;
      this.addDescribedTask(task);
    }
  } else if (typeof config === 'undefined') {
    return;
  } else {
    throw new Error('Invalid configuration type: ' + typeof config);
  }
};

module.exports = Helper;
