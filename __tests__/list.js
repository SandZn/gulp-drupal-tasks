
var factory = require('../');
var expect = require('expect');

describe('Each task', function() {

  var tasks = factory({
    baseUrl: 'http://localhost'
  }, {});
  it('Should be a function.', function() {
    Object.keys(tasks).forEach(function (stepKey) {
      Object.keys(tasks[stepKey]).forEach(function (taskKey) {
        expect(tasks[stepKey][taskKey]).toBeA('function');
      });
    });
  });
  it('Should have a human readable description.', function() {
    Object.keys(tasks).forEach(function (stepKey) {
      Object.keys(tasks[stepKey]).forEach(function (taskKey) {
        expect(tasks[stepKey][taskKey].description).toBeA('string');
        expect(tasks[stepKey][taskKey].description).toMatch(/^[A-Z].*\.$/, 'Description for ' + stepKey + ':' + taskKey + ' should be in sentence form.');
      });
    });
  });
  it('Should have a human readable options object.', function() {
    Object.keys(tasks).forEach(function (stepKey) {
      Object.keys(tasks[stepKey]).forEach(function (taskKey) {
        expect(tasks[stepKey][taskKey].options).toBeA('object');
        Object.keys(tasks[stepKey][taskKey].options).forEach(function(option) {
          expect(tasks[stepKey][taskKey].options[option]).toBeA('string');
          expect(tasks[stepKey][taskKey].description).toMatch(/^[A-Z].*\.$/, 'Description for ' + stepKey + ':' + taskKey + ' - ' + option + ' should be in sentence form.');
        });
      });
    });
  });
});
