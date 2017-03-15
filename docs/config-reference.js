(function() {

  // Set up some common variables here that will be reused below.
  var baseUrl = 'http://localhost:8888';
  var phpCheck = "**.php";
  var jsCheck = "**.js"

  /**
   * This is the sample configuration file for these tasks.
   *
   * Configure your tools here.  If any sections are omitted, the tasks associated
   * with them will be skipped.  For example, if you don't add a `backstopjs`
   * section, test:backstop will not be available.
   */
  var config = {
    // The config version.  Right now there's only 1.
    "version": 1,

    "bower": {
      "src": "./bower.json"
    },
    "composer": {
      "src": "./composer.json"
    },
    "phpcs": {
      // src is a gulp glob
      "src": phpCheck
    },
    "phplint": {
      // src is a gulp glob
      "src": phpCheck
    },
    "eslint": {
      // src is a gulp glob
      "src": jsCheck
    },
    "behat": {
      "configFile": "behat.yml"
    },
    "backstopjs": {
      "src": "backstop/backstop.js",
      "baseUrl": baseUrl,
      "artifactGlob": "backstop/reports/**",
      "junitGlob": "backstop/**.xml"
    },
    "phantomas": {
      "src": "phantomas/phantomas.yml",
      "baseUrl": baseUrl
    },
    "scss": {
      "theme": {
        // src is a gulp glob
        "src": "*.scss",
        "dest": "dist/",
        "minify": true,
      }
    },
    "js": {
      "theme": {
        "src": "*.js",
        "dest": "dist/",
        "minify": true,
      }
    },
    "copy": {
      "theme": {
        "src": "*.jpg",
        "imagemin": true,
        "dest": "dist/"
      }
    }
  };

  module.exports = config;
})();
