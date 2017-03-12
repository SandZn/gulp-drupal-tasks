/* eslint-env node */
(function () {
  'use strict';

  var baseUrl = process.env.BASE_URL;

  var refdir = baseUrl.match(/\/rebase$/) ? 'out/reference' : 'reference';

  module.exports = {
    id: 'visual',
    viewports: [
      {
        "name": "phone",
        "width": 320,
        "height": 480
      }
    ],
    scenarios: [
      {
        label: 'Homepage',
        url: baseUrl + '/',
        hideSelectors: [],
        removeSelectors: [],
        selectors: [
          'document'
        ],
        misMatchThreshold: 0.1
      }
    ],
    engine: 'phantomjs',
    paths: {
      bitmaps_reference: refdir,
      bitmaps_test: 'out/comparisons',
      casper_scripts: '.',
      html_report: 'out/reports',
      ci_report: 'out'
    },
    report: ['CI', 'browser']
  };
})();
