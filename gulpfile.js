var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');

var paths = {
  sass: './client/styles/*.scss',
  cssRoot: './client/assets',
  server: './server.js',
  client: 'client/**/*'
}

gulp.task('sass', function () {
  gulp.src(paths.sass)
    .pipe(sass())
    .pipe(gulp.dest(paths.cssRoot));
});

gulp.task('watch', function() {
  // watch scss files
  gulp.watch('./client/assets/*.scss', ['sass']);

  // Watch any files in dist/, reload on change
  livereload.listen();
  gulp.watch([paths.client]).on('change', livereload.changed);
});

// TODO: watch out for dev mode vs prod mode
// FIXME
gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
})

gulp.task('express', function() {
  nodemon({
    script: paths.server,
  })

  // .on('change', ['lint'])
  .on('restart', function() {
    console.log('restarted server');
  })
})

gulp.task('default', ['sass', 'watch', 'express'], function (){

});

