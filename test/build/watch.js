var factory = require('../../lib/build/watch');
var expect = require('chai').expect;
var sinon = require('sinon');
var PluginError = require('gulp-util').PluginError;


describe('Watch Task', function() {

  it('Should require a gulp object to be passed', function() {
    expect(factory).to.throw(PluginError, 'gulp must be passed to watch');
    expect(factory.bind(null, {})).to.throw(PluginError, 'gulp must be passed to watch');
  })

  it('Should fail on an invalid config or opts being passed', function() {
    expect(factory.bind(factory, {tasks: {}}, '')).to.throw(PluginError, 'opts must be an object');
  });

  it('Should not modify the opts object', function() {
    var opts = Object.freeze({});
    factory({tasks: {}}, opts);
  });

  it('Should create a watch for each task that has a watch property', function() {
    var watch = sinon.spy()
    var gulp = {
      watch: watch,
      tasks: {
        foo: {
          fn: {
            _watch: 'baz'
          }
        }
      }
    };
    factory(gulp)();
    sinon.assert.calledOnce(watch);
    sinon.assert.calledWith(watch, 'baz', ['foo']);
  });

  it('Should not create a watch for any tasks that do not have a watch property', function() {
    var watch = sinon.spy()
    var gulp = {
      watch: watch,
      tasks: {
        foo: {
          fn: {}
        }
      }
    };
    factory(gulp)();
    sinon.assert.notCalled(watch);
  });

  it('Should skip extra properties in the tasks prototype chain', function() {
    var TaskList = function() {};
    TaskList.prototype.testProp = function() {};
    TaskList.prototype.testProp.fn = {_watch: 'foo'};
    var watch = sinon.spy()
    var gulp = {
      tasks: new TaskList(),
      watch: watch
    };
    factory(gulp)();
    sinon.assert.notCalled(watch);
  })
});
