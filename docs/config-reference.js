(function() {

  /**
   * This is the sample configuration file for these tasks.
   *
   * Configure your tools here.  If any sections are omitted, the tasks associated
   * with them will be skipped.  For example, if you don't add a `backstopjs`
   * section, test:backstop will not be available.
   */
  var config = {
    // The config version.  Right now there's only 1.
    'version': 1,

    'scss': {
      'theme': {
        // src is a gulp glob
        'src': '*.scss',
        'dest': 'dist/',
        'minify': true,
      }
    },
    'js': {
      'theme': {
        'src': '*.js',
        'dest': 'dist/',
        'minify': true,
      }
    },
    'copy': {
      'theme': {
        'src': '*.jpg',
        'imagemin': true,
        'dest': 'dist/'
      }
    }
  };

  module.exports = config;
})();
