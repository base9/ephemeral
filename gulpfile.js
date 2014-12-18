var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload');

gulp.task('sass', function () {
  gulp.src('./client/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./client/assets'));
});

gulp.task('server', function() {
  var server = require('./server.js');
  console.log("gulp has initiated server.")
});

gulp.task('watch', function() {
  // watch scss files
  gulp.watch('./client/assets/*.scss', ['sass']);

  // Watch any files in dist/, reload on change
  livereload.listen();
  gulp.watch(['client/**/*']).on('change', livereload.changed);

});


gulp.task('default', ['sass', 'server', 'watch'], function (){

});


