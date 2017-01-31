
var factory = require('../');
var expect = require('chai').expect;

describe('Each task', function() {

  var tasks = factory({
    baseUrl: 'http://localhost'
  }, {});
  it('Should be a function.', function() {
    Object.keys(tasks).forEach(function (stepKey) {
      Object.keys(tasks[stepKey]).forEach(function (taskKey) {
        expect(tasks[stepKey][taskKey]).to.be.a('function');
      });
    });
  });
  it('Should have a human readable description.', function() {
    Object.keys(tasks).forEach(function (stepKey) {
      Object.keys(tasks[stepKey]).forEach(function (taskKey) {
        expect(tasks[stepKey][taskKey].description).to.be.a('string');
        expect(tasks[stepKey][taskKey].description).to.match(/^[A-Z].*\.$/, 'Description for ' + stepKey + ':' + taskKey + ' should be in sentence form.');
      });
    });
  });
  it('Should have a human readable options object.', function() {
    Object.keys(tasks).forEach(function (stepKey) {
      Object.keys(tasks[stepKey]).forEach(function (taskKey) {
        expect(tasks[stepKey][taskKey].options).to.be.a('object');
        Object.keys(tasks[stepKey][taskKey].options).forEach(function(option) {
          expect(tasks[stepKey][taskKey].options[option]).to.be.a('string');
          expect(tasks[stepKey][taskKey].description).to.match(/^[A-Z].*\.$/, 'Description for ' + stepKey + ':' + taskKey + ' - ' + option + ' should be in sentence form.');
        });
      });
    });
  });
});
