var replace = require('gulp-replace');
var argv = require('yargs').argv;
var gulp = require('gulp');
var gutil = require("gulp-util");
var wait = require('gulp-wait');
var http = require('http');

var rename = require("gulp-rename");
var clean = require('gulp-clean');
var stream = require('webpack-stream');
var webpack = require("webpack");
var gulpWebpack = require("gulp-webpack");

var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var webpackDevConfig = require("./webpack.config.dev.js");

//Get previous name of module from package.json
var pckg = require('./package.json');
var oldName = pckg.name;
var name = (argv.name === undefined) ? 'abl-sdk-feathers' : argv.name;

gulp.task('new', ['js', 'css'], function () {
  gulp.src(['webpack.config.js', 'webpack.config.dev.js', 'package.json', 'karma.config.js'])
    .pipe(replace(oldName, name))
    .pipe(gulp.dest('./'), {
      overwrite: true
    });
});


gulp.task('js', function () {
  gulp.src(['src/*.js'])
    .pipe(replace(oldName, name))
    .pipe(rename({
      basename: name
    }))
    .pipe(gulp.dest('src/'), {
      overwrite: true
    });
});

gulp.task('css', function () {
  gulp.src(['src/*.css'])
    .pipe(rename({
      basename: name
    }))
    .pipe(gulp.dest('src/'), {
      overwrite: true
    });
});

gulp.task('generate', ['new'], function () {
  return gulp.src(['src/' + oldName + '.*', 'dst/*'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('watch-recompile', function () {
  return gulp.src(webpackConfig.entry[0])
    .pipe(gulpWebpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dst/'), {
      overwrite: true
    });
});

gulp.task('watch', function () {

  gulp.watch([
    'src/*.js',
    'src/*.css',
    'src/**/*.html'
  ], function () {
    gulp.start('watch-recompile');
  });
});



gulp.task("webpack-dev-server", function (callback) {


  var myConfig = Object.create(webpackDevConfig);
  var port = 3232;
  myConfig.entry.unshift("webpack-dev-server/client?http://0.0.0.0:" + port + "/", "webpack/hot/dev-server");

  myConfig.devtool = "eval";
  myConfig.debug = true;

  var server = new WebpackDevServer(webpack(myConfig), {
    hot: true,
    iframe: true,
    contentBase: "./samples",
    noInfo: true,
    disableHostCheck: true,
    clientLogLevel: 'none'
  }).listen(port, "0.0.0.0", function (err) {
    if (err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://localhost:" + port + "/webpack-dev-server/index.html");
  });

});



gulp.task('default', ['watch-recompile', 'webpack-dev-server', 'watch']);