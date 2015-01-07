var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

var path = {
  sass: './ionic/scss/*.scss',
  cssRoot: './ionic/www/css',
  server: './server/index.js',
  serverSideJs: './server/**/*.js',
  client: 'ionic/www/**/*',
  test: './test/**/*.js',
  clientSideJs: './ionic/www/js/**/*.js'
}

gulp.task('sass', function () {
  return gulp.src(path.sass)
    .pipe(sass())
    .pipe(gulp.dest(path.cssRoot));
});

gulp.task('watch', function() {
  // watch scss files
  gulp.watch(path.sass, ['sass']);

  // Watch any files in dist/, reload on change
  livereload.listen();
  gulp.watch(path.client).on('change', livereload.changed);

  //watch for any changes made to js files in client and server
  gulp.watch([path.clientSideJs, path.serverSideJs], ['lint']);
});

// TODO: watch out for dev mode vs prod mode
gulp.task('lint', function() {
  return gulp.src([path.clientSideJs, path.serverSideJs])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('mocha', function () {
  return gulp.src(path.test)
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('mochaWatch', function() {
  return gulp.watch(path.serverSideJs, ['mocha']);
})

gulp.task('expressDev', function() {
  nodemon({
    script: path.server,
  })

  .on('restart', function() {
    console.log('restarted server');
  });
});

/////////////Command-line API////////////////////////////
// $> gulp
gulp.task('default', ['lint', 'sass', 'watch', 'expressDev']);

// $> gulp test
gulp.task('test', ['mochaWatch', 'mocha']);
