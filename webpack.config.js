var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = {

  //  Defines the entrypoint of our application.
  entry: [path.resolve(__dirname, 'src/abl-sdk.min.js')],

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
      },
      {
        test: /\.css/,
        loaders: ['style', 'css'],
        include: __dirname + '/src'
      }
    ],
    preLoaders: [{
        test: /\.js$/,
        exclude: [
          path.resolve('node_modules/')
        ],
        loader: 'babel'
      }, {
        test: /\.js$/,
        include: path.resolve('src/'),
        loader: 'ng-annotate'
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
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      },
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ]
};