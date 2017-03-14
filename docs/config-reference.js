(function() {

  /**
   * This is the sample configuration file for these tasks.
   *
   * Defaults are given here.  You don't need to define all (or any) of these
   * properties if you don't need to override the defaults.
   */
  var config = {
    // The config version.  Right now there's only 1.
    version: 1,

    // The base URL of the server to use for BackstopJS and Phantomas tests.
    // It will be passed to your scripts as an environment variable.
    baseUrl: undefined,

    // The directory containing a bower.json file, to be installed during the
    // install:bower task.
    bowerJsonDirectory: undefined,

    // A gulp glob array or string pointing to the PHP files you want to check
    // during check:phpcs and check:phplint.
    phpCheck: [],

    // The PHPCS standard to use during check:phpcs.  This is a filepath to the
    // standard's XML file.
    phpcsStandard: undefined,

    // A gulp glob array or string pointing to the JS files you want to check
    // during check:eslint.
    jsCheck: [],

    // The default for this object is empty, but the options are shown below.
    behat: {
      // bin: 'vendor/bin/behat',
      // configFile: '/some/behat.yml',
    },

    // The default for this object is empty, but the options are shown below.
    backstopjs: {
      // src: 'path/to/backstop/backstop.js',
      // junitGlob: 'path/to/backstop/**.xml',
      // artifactGlob: 'path/to/backstop/reports/**'
    },

    phantomas: {
      bin: './node_modules/.bin/phantomas',
      // src: 'path/to/phantomas/config.yml'
    },

    // The default for this object is empty, but the options are shown below.
    // `scss` takes an object describing the packs of SCSS you want to compile.
    // `theme` and `libs` here are arbitrary identifiers.  You can use whatever
    // names you want.
    scss: {
    //   theme: {
    //     src: [],
    //     dest: null,
    //     maps: false,
    //     min: true,
    //     concat: false,
    //     prefix: { browsers: 'last 2 versions' },
    //     sassOptions: {},
    //   },
    //   libs: {
    //     src: [],
    //     dest: null,
    //     maps: false,
    //     min: true,
    //     concat: false,
    //     prefix: { browsers: 'last 2 versions' },
    //     sassOptions: {},
    //   }
    },

    // The default for this object is empty, but the options are shown below.
    // `js` takes an object describing the packs of JS you want to compile.
    // `theme` and `libs` here are arbitrary identifiers.  You can use whatever
    // names you want.
    js: {
      //   theme: {
      //     src: [],
      //     dest: null,
      //     concat: false,
      //     maps: './',
      //     min: true
      //   },
      //   libs: {
      //     src: [],
      //     dest: null,
      //     concat: false,
      //     maps: './',
      //     min: true
      //   },
    },

    // The default for this object is empty, but the options are shown below.
    // `js` takes an object describing the packs of files you want to copy on
    // build:copy. `theme` and `libs` here are arbitrary identifiers.  You can
    // use whatever names you want.
    copy: {
      // theme: {
      //   src: [],
      //   dest: null,
      //   imagemin: false,
      // },
      // libs: {
      //   src: [],
      //   dest: null,
      //   imagemin: false,
      // }
    }
  };

  module.exports = config;
})();
