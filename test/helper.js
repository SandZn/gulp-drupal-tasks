
var Helper = require('../lib/helper');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Gulp Helper', function() {
  var taskFactory = function(config, opts) {
    function task() {

    }
    task.displayName = 'task';
    task.description = 'foo';
    task._config = config;
    task._opts = opts;
    return task;
  };

  var gulp;
  var helper;

  beforeEach(function() {
    gulp = { tasks: {} };
    gulp.task = sinon.spy(function(name, description, deps, task) {
      gulp.tasks[name] = {
        fn: task,
        deps: deps,
        description: description,
      };
    });
    helper = new Helper(gulp);
  });

  describe('addDescribedTask', function() {
    it('Should set the name and description of the task', function() {
      var task = taskFactory({}, {});
      helper.addDescribedTask(task);
      sinon.assert.calledWith(gulp.task, 'task', 'foo', [], task);
    });

    it('Should add dependencies of the task', function() {
      var task = taskFactory({}, {});
      helper.addDescribedTask(task, ['baz']);
      sinon.assert.calledWith(gulp.task, 'task', 'foo', ['baz'], task);
    });
  });

  describe('addSubtask', function() {
    it('Should add nothing if there are no subtasks', function() {
      helper.addSubtasks(taskFactory, {}, {});
      sinon.assert.notCalled(gulp.task);
    });

    it('Should add subtasks if config is an object', function() {
      helper.addSubtasks(taskFactory, {
        foo: {}
      }, {});
      sinon.assert.calledOnce(gulp.task);
    });

    it('Should add subtasks if config is an array', function() {
      helper.addSubtasks(taskFactory, [
        {}
      ], {});
      sinon.assert.calledOnce(gulp.task);
    });

    it('Should suffix the name of the task', function() {
      helper.addSubtasks(taskFactory, {
        foo: {}
      }, {});
      sinon.assert.calledOnce(gulp.task);
      expect(gulp.tasks.hasOwnProperty('task:foo')).to.be.true;
    });

    it('Should set the config of each subtask', function() {
      helper.addSubtasks(taskFactory, {
        foo: { bar: 'baz' }
      }, {});
      sinon.assert.calledOnce(gulp.task);
      expect(gulp.tasks['task:foo'].fn._config).to.eql({
        bar: 'baz'
      });
    });

    it('Should not consider the inherited properties of the config object', function() {
      function MyConfig() { }
      MyConfig.prototype.someProp = function() { };
      helper.addSubtasks(taskFactory, new MyConfig());
      sinon.assert.notCalled(gulp.task);
    });
  });

  describe('addMetaTask', function() {
    it('Should consider all top level tasks', function() {
      gulp.tasks = {
        'build:scss': {},
        'build:js': {}
      };
      helper.addMetaTask('build', 'Run build tasks');
      sinon.assert.calledOnce(gulp.task);
      sinon.assert.calledWith(gulp.task, 'build', 'Run build tasks', ['build:scss', 'build:js']);
    });

    it('Should not consider second level tasks', function() {
      gulp.tasks = {
        'build:scss': {},
        'build:js': {},
        'build:js:theme': {}
      };
      helper.addMetaTask('build', 'Run build tasks');
      sinon.assert.calledOnce(gulp.task);
      sinon.assert.calledWith(gulp.task, 'build', 'Run build tasks', ['build:scss', 'build:js']);
    });
  });
});
