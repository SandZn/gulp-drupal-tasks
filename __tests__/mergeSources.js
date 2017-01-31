
var expect = require('chai').expect;
var mergeSources = require('../mergesources');

describe('mergeSources', function() {
  it('Should merge an array of asset packs.', function() {
    var out = mergeSources([
      { src: 'foo' },
      { src: ['bar', 'baz'] }
    ]);
    expect(out).to.deep.equal(['foo', 'bar', 'baz']);
  });
});
