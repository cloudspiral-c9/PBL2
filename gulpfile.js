'use strict';

var gulp, sass,connect,autoprefixer,uglify,minifyHTML;

gulp = require("gulp");
sass = require('gulp-ruby-sass');
connect = require('gulp-connect');
autoprefixer = require('gulp-autoprefixer');
uglify = require('gulp-uglify');
minifyHTML = require('gulp-minify-html');


gulp.task('connectDev', function () {
  connect.server({
    root:['./app/'],
    port:8000,
    livereload:true
  });
});

gulp.task('reload',function() {
  gulp.src('./app/view/*.html')
    .pipe(connect.reload());
});

gulp.task('html',function(){
  gulp.src('./app/view/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./app/view-min'));
});

gulp.task('sass', function () {
  gulp.src('./app/sass/*.scss')
    .pipe(sass({
      style: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/css'));
});

gulp.task('js',function(){
  gulp.src('./app/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./app/js-min'));

  gulp.src('./app/js/controllers/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./app/js-min/controllers'));

    gulp.src('./app/js/derectives/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./app/js-min/derectives'));

    gulp.src('./app/js/filters/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./app/js-min/filters'));

    gulp.src('./app/js/services/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./app/js-min/services'));

    gulp.src('./app/js/util/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./app/js-min/util'));
});

gulp.task('watch',function() {
  gulp.watch(['./app/view/*.html'],['html']);
  gulp.watch(['./app/sass/*.scss'],['sass']);
  gulp.watch(['./app/js/*.js'],['js']);
  gulp.watch(['./app/view/*.html'],['reload']);
  gulp.watch(['./app/css/*.css'],['reload']);
  gulp.watch(['./app/js/*.js'],['reload']);
});

gulp.task('default', ['watch','connectDev']);
