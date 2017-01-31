
var expect = require('chai').expect;

describe('Bower task', function() {
  var mockSpawn = jest.fn(function() {
    return new Promise(function(resolve) {
      resolve();
    });
  });
  jest.mock('child-process-promise', function() {
    return { spawn: mockSpawn };
  });

  var factory = require('../bower');
  var withBowerJson = factory({
    bowerJsonDirectory: '/tmp'
  });
  var withoutBowerJson = factory(({}));

  it('Should return a promise when there is a bower directory defined', function() {
    mockSpawn.mockClear();
    expect(withBowerJson()).to.be.an.instanceof(Promise);
  });
  it('Should return a promise when there is no bower directory defined', function() {
    mockSpawn.mockClear();
    expect(withoutBowerJson()).to.be.an.instanceof(Promise);
  });

  it('Should call bower when there is a bower directory defined', function() {
    mockSpawn.mockClear();
    withBowerJson();
    expect(mockSpawn.mock.calls.length).to.equal(1);
    expect(mockSpawn.mock.calls[0]).to.deep.equal(['bower', ['install', '--allow-root'], { cwd: '/tmp', stdio: ['inherit', 'inherit', 'inherit'] }]);
  });
  it('Should not call bower when there is no bower directory defined', function() {
    mockSpawn.mockClear();
    withoutBowerJson();
    expect(mockSpawn.mock.calls.length).to.equal(0);
  });

  it('Should not accept anything but a string for the bower.json directory', function() {
    expect(function() {
      factory({
        bowerJsonDirectory: null
      })();
    }).to.throw('config.bowerJsonDirectory should be string');
  });
});
