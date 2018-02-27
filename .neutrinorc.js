module.exports = {
  use: [
    '@neutrinojs/standardjs',
    [
      '@neutrinojs/web',
      {
        html: {
          title: 'tic-tac-tow-ajs'
        }
      }
    ],
    '@neutrinojs/html-loader',
    './neutrino.js',
    '@neutrinojs/jest'
  ]
};
