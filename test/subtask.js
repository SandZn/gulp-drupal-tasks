
var factory = require('../lib/subtask').factory;
var lister = require('../lib/subtask').lister;

var expect = require('chai').expect;

describe('Subtask factory', function() {
  var taskFactory = function(config, opts) {
    function task() {

    }
    task.displayName = 'task';
    task.description = 'foo';
    task._config = config;
    task._opts = opts;
    return task;
  };

  it('Should return an array if there are no subtasks', function() {
    var tasks = factory(taskFactory, {}, {});
    expect(tasks).to.eql([]);
    expect(lister(tasks)).to.eql([]);
  });

  it('Should fail to create subtasks if an invalid config is passed', function() {
    expect(factory.bind(null, taskFactory, '', {})).to.throw(Error);
  });

  it('Should build an array of subtasks for a config object', function() {
    var tasks = factory(taskFactory, {
      task1: {},
      task2: {},
    }, {});
    expect(tasks).to.be.an('array');
    expect(tasks.length).to.equal(2);
    expect(lister(tasks)).to.eql(['task:task1', 'task:task2']);
  });

  it('Should build an array of subtasks for a config array', function() {
    var tasks = factory(taskFactory, [
      {},
      {}
    ], {});
    expect(tasks).to.be.an('array');
    expect(tasks.length).to.equal(2);
    expect(lister(tasks)).to.eql(['task:0', 'task:1']);
  });

  it('should transfer config to subtasks for a config object', function() {
    var tasks = factory(taskFactory, {
      task1: { config1: true },
    }, { opt1: true });
    expect(tasks).to.be.an('array');
    expect(tasks.length).to.equal(1);
    expect(tasks[0]._config).to.eql({
      config1: true,
    });
    expect(tasks[0]._opts).to.eql({
      opt1: true,
    });
  });

  it('Should transfer config to subtasks for a config array', function() {
    var tasks = factory(taskFactory, [
      { config1: true },
    ], { opt1: true });
    expect(tasks).to.be.an('array');
    expect(tasks.length).to.equal(1);
    expect(tasks[0]._config).to.eql({
      config1: true,
    });
    expect(tasks[0]._opts).to.eql({
      opt1: true,
    });
  });
});
