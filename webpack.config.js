var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var vendorLibs = require(path.resolve(__dirname, 'vendor.js'));
module.exports = {
  //  Defines the entrypoint of our application. entry: [path.resolve(__dirname,
  // 'src/abl-sdk.js')],
  entry: {
    'abl-sdk': [path.resolve(__dirname, 'src/abl-sdk.js')],
    vendor: vendorLibs.core
  },
  output: {
    path: path.resolve(__dirname, 'dst'),
    filename: 'abl-sdk.min.js'
  },
  devtool: 'source-map',

  //  Define externals (things we don't pack).
  externals: {
    angular: 'angular',
    feathers: /^(feathers|\$)$/i
  },

  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel',
        include: __dirname + '/src',
        query: {
          cacheDirectory: true, //important for performance
          plugins: ['transform-regenerator'],
          presets: ['es2015']
        }
      },
      {
        test: /\.css/,
        loaders: ['style', 'css'],
        include: __dirname + '/src'
      }
    ],
    preLoaders: [
      {
        test: /\.js$/,
        include: path.resolve('src/'),
        loader: 'ng-annotate-loader'
      },
      {
        test: /\.html$/,
        include: path.resolve('src/'),
        loader: 'html-loader'
      }
    ]
  },
  babel: {
    presets: ['es2015']
  },
  plugins: [
    new ngAnnotatePlugin({ add: true, sourcemap: true }),
    new webpack.optimize.CommonsChunkPlugin(
      /* chunkName= */ 'vendor',
      /* filename= */
      'abl-sdk.vendor.min.js'
    ),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourceMap: true,
      compress: {
        warnings: true,
        drop_debugger: true,
        drop_console: true
      }
    })
  ]
};
