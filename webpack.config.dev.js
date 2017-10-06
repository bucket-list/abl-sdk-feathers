var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var vendorLibs = require(path.resolve(__dirname, 'vendor.js'));

module.exports = {

  //  Defines the entrypoint of our application.
  entry: {
    'abl-sdk': [path.resolve(__dirname, 'src/abl-sdk.js')],
    vendor: vendorLibs.core
  },

  //  Bundle to ./dst.
  output: {
    path: path.resolve(__dirname, 'dst'),
    filename: 'abl-sdk.js'
  },

  //  Make sure we include sourcemaps. This is for the bundled
  //  code, not the uglfied code (we uglify with npm run build,
  //  see package.json for details).
  // devtool: 'source-map',

  //  Define externals (things we don't pack).
  externals: {
    angular: 'angular',
    feathers: /^(feathers|\$)$/i
  },

  module: {
    loaders: [{
        test: /\.js/,
        loader: 'babel',
        query: {
          cacheDirectory: true, //important for performance
          plugins: ["transform-regenerator"],
          presets: ["es2015"]
        },
        include: [__dirname + '/src', __dirname + '/samples']
      },
      {
        test: /\.css/,
        loaders: ['style', 'css'],
        include: __dirname + '/src'
      }
    ],
    preLoaders: [
      // {
      //   test: /\.js$/,
      //   exclude: [
      //     path.resolve('node_modules/')
      //   ],
      //   loader: 'babel'
      // },
      {
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
    new ExtractTextPlugin("styles.css"),
    new ngAnnotatePlugin({
      add: true
      // other ng-annotate options here 
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   exclude: ['abl-sdk.vendor.*'],
    //   mangle: false,
    //   sourceMap: false,
    //   compress: false
    // }),
    new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "vendor", /* filename= */ "vendor/abl-sdk.vendor.js"),

    new webpack.HotModuleReplacementPlugin()
  ]
};