
var path = require('path');
var factory = require('../behat');
var which = require('which');

var inpath = path.join(__dirname, '../../__fixtures');

describe('Behat Task', function() {

  it('Should run behat', function(done) {
    var stream = factory({
      configFile: path.join(inpath, 'behat.yml'),
      bin: which.sync('behat'),
      suite: 'passing',
      silent: true,
    })();
    stream.on('error', done.fail);
    stream.on('end', done);
    stream.resume();
  });

  it('Should throw an error on behat failures', function(done) {
    var stream = factory({
      configFile: path.join(inpath, 'behat.yml'),
      bin: which.sync('behat'),
      suite: 'failing',
      silent: true,
    })();
    stream.on('error', done);
    stream.on('end', done.fail.bind(null, new Error('Task did not fail.')));
    stream.resume();
  });
})
