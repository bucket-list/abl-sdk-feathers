var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var nodeModulesDir = path.join(__dirname, 'node_modules');

var deps = require(path.resolve(__dirname, 'vendor.js'));
config = {
  //  Defines the entrypoint of our application. entry: [path.resolve(__dirname,
  // 'src/abl-sdk.js')],
  entry: {
    'abl-sdk': [path.resolve(__dirname, 'src/index.js')],
    vendor: deps.legacy.concat(deps.core)
  },
  output: {
    path: path.resolve(__dirname, 'dst'),
    filename: 'abl-sdk.min.js'
  },
  resolve: {
    alias: {
      angular: __dirname + '/node_modules/angular/angular.min'
    }
  },
  // devtool: 'source-map',
  module: {
    noParse: [],
    loaders: [
      { test: /[\/]angular.min\.js$/, loader: 'exports?angular' },
      {
        test: /\.js$/,
        include: path.resolve('src/'),
        loader: 'ng-annotate-loader'
      },
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
    // new webpack.optimize.UglifyJsPlugin(uglifyConfig),
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: Infinity,

      name: 'vendor',
      filename: 'abl-sdk.vendor.min.js'
    })
  ]
};

var uglifyConfig = {
  mangle: false,
  exclude: ['/abl-sdk.vendor.min.js/'],
  sourceMap: false
  // compress: {
  //   warnings: false,
  //   drop_debugger: true,
  //   drop_console: true
  // }
};
// Run through deps and extract the first part of the path,
// as that is what you use to require the actual node modules
// in your code. Then use the complete path to point to the correct
// file and make sure webpack does not try to parse it
var fs = require('fs');
function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
var total = 0;
deps.legacy.forEach(function(dep) {
  var depPath = dep.split('/')[0];
  // console.log('dep', dep, depPath);
  config.resolve.alias[dep.split(path.sep)[0]] = dep;
  config.module.noParse.push(new RegExp(path.resolve(nodeModulesDir, dep)));
  total += getFilesizeInBytes(path.resolve(nodeModulesDir, dep));
  console.log(depPath, getFilesizeInBytes(path.resolve(nodeModulesDir, dep)));
});

console.log('total size (B)', total);
console.log(config.module.noParse);
console.log(config.resolve);

module.exports = config;
