const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { baseConfig } = require('./webpack.config.base');

const PUBLIC_PATH = '';

module.exports = Object.assign({}, baseConfig, {
  mode: 'production',
  devtool: false, // 'source-map',
  output: Object.assign({}, baseConfig.output, {
    filename: 'assets/[name].bundle.js?v=[hash:5]',
    chunkFilename: 'assets/[name].chunk.js?v=[chunkhash:5]',
  }),
  module: Object.assign({}, baseConfig.module, {
    rules: baseConfig.module.rules.concat([
      {
        test: /\.(ico|png|mp3|wav|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'images/[name].[ext]?v=[hash:5]',
        },
      },
      {
        test: /\.gif$/,
        loader: 'url-loader',
        options: {
          limit: 0,
          name: 'images/[name].[ext]',
        },
      },
    ]),
  }),
  plugins: baseConfig.plugins.concat([
    new SWPrecacheWebpackPlugin({
      cacheId: 'btcc-front-end',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'btcc-service-worker.js',
      minify: true,
      navigateFallback: `${PUBLIC_PATH}index.html`,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        compressor: {
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false,
        },
        output: {
          comments: false,
        },
      },
    }),
  ]),
});
