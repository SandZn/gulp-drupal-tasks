

var expect = require('chai').expect;

describe('Composer task', function() {
  var mockSpawn = jest.fn(function() {
    return new Promise(function(resolve) {
      resolve();
    });
  });
  jest.mock('child-process-promise', function() {
    return { spawn: mockSpawn };
  });

  var factory = require('../composer');
  var task = factory();

  it('Should return a promise when called', function() {
    mockSpawn.mockClear();
    expect(task()).to.be.an.instanceOf(Promise);
  });
  it('Should call composer install', function() {
    mockSpawn.mockClear();
    expect(task()).to.be.an.instanceOf(Promise);
    expect(mockSpawn.mock.calls.length).to.equal(1);
    expect(mockSpawn.mock.calls[0]).to.deep.equal(['composer', ['install'], { stdio: ['inherit', 'inherit', 'inherit'] }]);
  });
});
