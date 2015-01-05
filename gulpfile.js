var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

var path = {
  sass: './client/styles/*.scss',
  cssRoot: './client/assets',
  server: './server.js',
  serverSideJs: './server/**/*.js',
  client: 'client/**/*',
  test: './test/**/*.js'
}

gulp.task('sass', function () {
  gulp.src(path.sass)
    .pipe(sass())
    .pipe(gulp.dest(path.cssRoot));
});

gulp.task('watch', function() {
  // watch scss files
  gulp.watch('./client/assets/*.scss', ['sass']);

  // Watch any files in dist/, reload on change
  livereload.listen();
  gulp.watch([path.client]).on('change', livereload.changed);
});

// TODO: watch out for dev mode vs prod mode
// FIXME
gulp.task('lint', function() {
  return gulp.src(path.js)
    .pipe(jshint())
})

gulp.task('test', function() {
  gulp.watch(path.serverSideJs, ['mocha'])
})

gulp.task('mocha', function () {
  return gulp.src(path.test)
    .pipe(mocha({reporter: 'nyan'}))
})

gulp.task('express', function() {
  nodemon({
    script: path.server,
  })

  // .on('change', ['lint'])
  .on('restart', function() {
    console.log('restarted server');
  })
})

gulp.task('default', ['sass', 'watch', 'express'], function (){

});

