var replace = require('gulp-replace');
var argv = require('yargs').argv;
var gulp = require('gulp');
var gutil = require('gulp-util');
var wait = require('gulp-wait');
var http = require('http');
var gulpSequence = require('gulp-sequence');
var concat = require('gulp-concat');

var rename = require('gulp-rename');
var clean = require('gulp-clean');
var stream = require('webpack-stream');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');

var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var webpackDevConfig = require('./webpack.config.dev.js');

//Get previous name of module from package.json
var pckg = require('./package.json');
var oldName = pckg.name;
var name = argv.name === undefined ? 'abl-sdk-feathers' : argv.name;

var _gulpStart = gulp.Gulp.prototype.start;

var _runTask = gulp.Gulp.prototype._runTask;

gulp.Gulp.prototype.start = function(taskName) {
  this.currentStartTaskName = taskName;

  _gulpStart.apply(this, arguments);
};

gulp.Gulp.prototype._runTask = function(task) {
  this.currentRunTaskName = task.name;

  _runTask.apply(this, arguments);
};

// console.log('this.currentStartTaskName: ' + this.currentStartTaskName);
// console.log('this.currentRunTaskName: ' + this.currentRunTaskName);

//Live reload socket for sandbox area
// var io = require('socket.io')(8889);
// gulp.watch(['samples/**/*'], () => {
//   io.emit('reload');
// });

gulp.task('new', ['js', 'css'], function() {
  gulp
    .src([
      'webpack.config.js',
      'webpack.config.dev.js',
      'package.json',
      'karma.config.js'
    ])
    .pipe(replace(oldName, name))
    .pipe(gulp.dest('./'), {
      overwrite: true
    });
});

gulp.task('js', function() {
  gulp
    .src(['src/*.js'])
    .pipe(replace(oldName, name))
    .pipe(
      rename({
        basename: name
      })
    )
    .pipe(gulp.dest('src/'), {
      overwrite: true
    });
});

gulp.task('css', function() {
  gulp
    .src(['src/*.css'])
    .pipe(
      rename({
        basename: name
      })
    )
    .pipe(gulp.dest('src/'), {
      overwrite: true
    });
});

gulp.task('generate', ['new'], function() {
  return gulp
    .src(['src/' + oldName + '.*', 'dst/*'], {
      read: false
    })
    .pipe(clean());
});

var del = require('del');

gulp.task('clean-dst', function(callback) {
  del(['dst/*.js', 'dst/*.js.map', '!dst/vendor.js'], {
    force: true
  }).then(function() {
    callback();
  });
});

gulp.task('dev', function(callback) {
  return gulp
    .src(webpackDevConfig.entry['abl-sdk'][0])
    .pipe(gulpWebpack(require('./webpack.config.dev.js')))
    .pipe(gulp.dest('dst/'), {
      overwrite: true
    });
});

gulp.task('dist', function() {
  return gulp
    .src(webpackConfig.entry['abl-sdk'][0])
    .pipe(gulpWebpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dst/'), {
      overwrite: true
    });
});

gulp.task('watch-recompile', function(callback) {
  if (task == 'dev-min') return gulpSequence(['dist'], callback);
  if (task == 'dev-live') return gulpSequence(['dev'], callback);
  if (task == 'default') return gulpSequence(['dev'], ['dist'], callback);
});

gulp.task('watch', function() {
  console.log(task);

  gulp.watch(
    ['src/**/*.js', '!src/vendor.js', 'src/**/*.css', 'src/**/*.html'],
    function() {
      gulp.start('watch-recompile');
    }
  );

  gulp.watch(['samples/**/*'], () => {
    gulp.start('sample-app-webpack');
  });
  gulp.watch(['samples/dst/*'], () => {
    // io.emit('reload');
  });

  gulp.watch(['src/vendor.js'], function() {
    gulp.start('dlls');
  });
});

gulp.task('sample-app-webpack', function(callback) {
  return gulp
    .src(__dirname + '/samples/sampleapp.js')
    .pipe(
      gulpWebpack({
        module: {
          loaders: [
            {
              test: /\.js/,
              loader: 'babel',
              query: {
                plugins: ['transform-regenerator'],
                presets: ['es2015']
              },
              include: __dirname + '/samples'
            }
          ]
        },
        output: {
          filename: 'sampleapp.js'
        },
        babel: {
          presets: ['es2015']
        }
      })
    )
    .pipe(gulp.dest('samples/dst/'));
});

gulp.task('webpack-dev-server', function(callback) {
  var myConfig = Object.create(webpackDevConfig);
  var port = 3233;
  myConfig.entry['abl-sdk'].unshift(
    'webpack-dev-server/client?http://0.0.0.0:' + port + '/',
    'webpack/hot/dev-server'
  );

  myConfig.devtool = 'eval';
  myConfig.debug = true;

  var server = new WebpackDevServer(webpack(myConfig), {
    hot: true,
    inline: true,
    contentBase: ['./samples', './dst'],
    noInfo: true,
    disableHostCheck: true,
    clientLogLevel: 'none',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).listen(port, '0.0.0.0', function(err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log(
      '[webpack-dev-server]',
      'http://localhost:' + port + '/webpack-dev-server/index.html'
    );
  });
});
var task = this.currentStartTaskName;

gulp.task('getTask', function(callback) {
  task = this.currentStartTaskName;
});

gulp.task('dev-live', [
  'getTask',
  'watch-recompile',
  'sample-app-webpack',
  'webpack-dev-server',
  'watch'
]);
gulp.task('dev-min', ['getTask', 'watch', 'watch-recompile']);
gulp.task('default', ['dev-live']);
