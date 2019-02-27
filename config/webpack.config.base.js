const webpack = require('webpack');
const { resolve } = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const ROOT_PATH = resolve(__dirname);
const BASE_PATH = resolve(ROOT_PATH, '../src');
const BUILD_PATH = resolve(ROOT_PATH, '../build');

console.log(BASE_PATH);

const commonExtract = new MiniCssExtractPlugin({
  filename: devMode ? 'assets/[name].bundle.css' : 'assets/[name].bundle.css?v=[contenthash:5]',
});

exports.baseConfig = {
  entry: {
    vendor: [BASE_PATH],
  },
  output: {
    publicPath: '/',
    path: BUILD_PATH,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
        modules: {
          test: /[\\/]node_modules[\\/]/,
          name: 'modules',
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[local]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(ttf|eot|otf|woff(2)?)(\?[a-z0-9]+)?$/,
        include: resolve('../src/fonts'),
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          'svg-react-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        // section to check source files, not modified by other loaders
        enforce: 'pre',
      },
    ],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new HtmlwebpackPlugin({
      template: 'src/index.html',
      chunks: ['vendor'],
      // inject: false,
      // process: devMode,
      minify: !devMode ? {
        removeAttributeQuotes: true,
        // removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: !devMode,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyURLs: true,
      } : '',
    }),
    commonExtract,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    hotOnly: true,
    contentBase: BASE_PATH,
    disableHostCheck: true,
    compress: true,
    port: 3005,
    host: '0.0.0.0',
    historyApiFallback: {
      disableDotRule: true,
    },
  },
};
