var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
module.exports = {

  //  Defines the entrypoint of our application.
  entry: [path.resolve(__dirname, 'src/abl-sdk.js')],

  //  Bundle to ./dst.
  output: {
    path: path.resolve(__dirname, 'dst'),
    filename: 'abl-sdk.min.js'
  },
  devtool: 'source-map',

  //  Define externals (things we don't pack).
  externals: {
    angular: 'angular',
  },

  module: {
    loaders: [{
      test: /\.js/,
      loader: 'babel',
      include: __dirname + '/src',
      query: {
        cacheDirectory: true, //important for performance
        plugins: ["transform-regenerator"]
      },
      include: __dirname + '/src'
    }, {
      test: /\.css/,
      loaders: ['style', 'css'],
      include: __dirname + '/src'
    }],
    preLoaders: [{
        test: /\.js$/,
        exclude: [
          path.resolve('node_modules/')
        ],
        loader: 'babel'
      }, {
        test: /\.js$/,
        include: path.resolve('src/'),
        loader: 'ng-annotate-loader'
      },
      {
        test: /\.html$/,
        include: path.resolve('src/'),
        loader: "html-loader"
      }
    ]
  },
  babel: {

    presets: ['es2015']
  },
  plugins: [
    new ExtractTextPlugin("abl-sdk.css"),
    new ngAnnotatePlugin({
      add: true
      // other ng-annotate options here 
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['angular',
          '$super', '$', 'exports', 'require'
        ]
      },
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ]
};